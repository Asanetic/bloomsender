/**
 * FILE: messaging-actions.js
 * PURPOSE: Backend API handlers for messaging-actions
 */

import {
  base64Decode,
  magicRandomStr,
  mosyFlexQuickSel,
  mosyRightNow,
  mosySqlInsert,
  mosySqlUpdate
} from '../../../apiUtils/dataControl/dataUtils';
import { mosySendSMS } from '../../../apiUtils/dataControl/send-sms';
import { mosySendEmail } from '../../../apiUtils/dataControl/send-gmail';

const MESSAGE_TABLE = 'messaging';

function safeText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function safeSqlValue(value) {
  return safeText(value).replace(/'/g, "''");
}

function normalizeMessageType(value) {
  return safeText(value, '').toLowerCase();
}

function parseMessageTypeFlags(value) {
  const type = normalizeMessageType(value);

  return {
    sms: type.includes('sms'),
    email: type.includes('email') || type.includes('mail'),
    whatsapp: type.includes('whatsapp') || type.includes('whats app')
  };
}

function toMessageTypeLabel({ sms = false, email = false, whatsapp = false } = {}) {
  if (sms && email && whatsapp) return 'EMAIL and SMS and WhatsApp';
  if (sms && email) return 'EMAIL and SMS';
  if (sms && whatsapp) return 'SMS and WhatsApp';
  if (email && whatsapp) return 'Email and WhatsApp';
  if (whatsapp) return 'WhatsApp';
  if (sms) return 'SMS';
  if (email) return 'Email';
  return '';
}

function mergeMessageTypeLabels(existingType, newType) {
  const existingFlags = parseMessageTypeFlags(existingType);
  const newFlags = parseMessageTypeFlags(newType);

  return toMessageTypeLabel({
    sms: existingFlags.sms || newFlags.sms,
    email: existingFlags.email || newFlags.email,
    whatsapp: existingFlags.whatsapp || newFlags.whatsapp
  });
}

function shouldSendSms(messageType, receiverTel) {
  if (!safeText(receiverTel)) return false;
  if (!messageType) return true;

  return (
    messageType.includes('sms') ||
    messageType.includes('both') ||
    messageType.includes('all')
  );
}

function shouldSendEmail(messageType, receiverEmail) {
  if (!safeText(receiverEmail)) return false;
  if (!messageType) return true;

  return (
    messageType.includes('email') ||
    messageType.includes('mail') ||
    messageType.includes('both') ||
    messageType.includes('all')
  );
}

function buildMessageBody({ message_details, message_signature }) {
  const details = safeText(message_details);
  const signature = safeText(message_signature);

  if (details && signature) {
    return `${details}\n\n${signature}`;
  }

  return details || signature;
}

function estimateSmsMetrics(messageBody, existingSmsCost) {
  const msgLen = safeText(messageBody).length;
  const pageCount = Math.max(Math.ceil(msgLen / 160), 1);

  if (existingSmsCost !== '' && existingSmsCost !== null && existingSmsCost !== undefined) {
    return {
      pageCount,
      smsCost: toNumber(existingSmsCost, pageCount)
    };
  }

  return {
    pageCount,
    smsCost: pageCount
  };
}

function buildBaseMessageRecord({ auth, payload, messageId }) {
  const now = mosyRightNow();

  return {
    messageid: messageId,
    receiver_contacts: safeText(payload?.receiver_contacts),
    receiver_tel: safeText(payload?.receiver_tel),
    receiver_email: safeText(payload?.receiver_email),
    reciver_names: safeText(payload?.reciver_names),
    message_type: safeText(payload?.message_type),
    site_id: safeText(payload?.site_id),
    group_name: safeText(payload?.group_name),
    message_date: safeText(payload?.message_date, now),
    sent_state: safeText(payload?.sent_state, 'pending'),
    msg_read_state: safeText(payload?.msg_read_state, 'unread'),
    subject: safeText(payload?.subject),
    message_label: safeText(payload?.message_label),
    message_details: safeText(payload?.message_details),
    sms_cost: toNumber(payload?.sms_cost, 0),
    page_count: toNumber(payload?.page_count, 0),
    hive_site_id: safeText(auth?.hive_site_id),
    hive_site_name: safeText(auth?.hive_site_name),
    custom_dictionary: safeText(payload?.custom_dictionary),
    message_signature: safeText(payload?.message_signature),
    ref_number: safeText(payload?.ref_number)
  };
}

async function persistDraftRecord(baseRecord, payload) {
  const decodedPrimKey = safeText(base64Decode(safeText(payload?.messaging_dataNode)));
  const hasNumericPrimKey = /^\d+$/.test(decodedPrimKey);
  const hasMessageId = !!safeText(baseRecord.messageid);

  if (hasMessageId) {
    const whereByMessageId = `messageid='${safeSqlValue(baseRecord.messageid)}'`;
    const updateResult = await mosySqlUpdate(MESSAGE_TABLE, baseRecord, baseRecord, whereByMessageId);

    if (Number(updateResult?.affectedRows || 0) > 0) {
      return { ...updateResult, mode: 'updated', where: whereByMessageId };
    }
  }

  if (hasNumericPrimKey) {
    const whereByPrimKey = `primkey='${decodedPrimKey}'`;
    const updateResult = await mosySqlUpdate(MESSAGE_TABLE, baseRecord, baseRecord, whereByPrimKey);

    if (Number(updateResult?.affectedRows || 0) > 0) {
      return { ...updateResult, mode: 'updated', where: whereByPrimKey };
    }
  }

  const insertResult = await mosySqlInsert(MESSAGE_TABLE, baseRecord, baseRecord);
  return { ...insertResult, mode: 'inserted', where: '' };
}

async function updateSentState(whereStr, updates) {
  if (!whereStr) return null;
  return await mosySqlUpdate(MESSAGE_TABLE, updates, updates, whereStr);
}

async function getExistingMessageType({ payload, messageId }) {
  const payloadMessageId = safeText(payload?.messageid || payload?.NodeId);
  const resolvedMessageId = payloadMessageId || safeText(messageId);

  if (resolvedMessageId) {
    const rowByMessageId = await mosyFlexQuickSel(
      MESSAGE_TABLE,
      'message_type',
      `WHERE messageid='${safeSqlValue(resolvedMessageId)}'`,
      'r'
    );

    if (rowByMessageId?.message_type) {
      return safeText(rowByMessageId.message_type);
    }
  }

  const decodedPrimKey = safeText(base64Decode(safeText(payload?.messaging_dataNode)));
  const hasNumericPrimKey = /^\d+$/.test(decodedPrimKey);

  if (!hasNumericPrimKey) {
    return '';
  }

  const rowByPrimKey = await mosyFlexQuickSel(
    MESSAGE_TABLE,
    'message_type',
    `WHERE primkey='${decodedPrimKey}'`,
    'r'
  );

  return safeText(rowByPrimKey?.message_type);
}

async function executeSend({ auth, payload, forceResend = false }) {
  const messageId = safeText(payload?.messageid || payload?.NodeId) || magicRandomStr(7);
  const existingMessageType = await getExistingMessageType({ payload, messageId });

  const baseRecord = buildBaseMessageRecord({ auth, payload, messageId });
  const persisted = await persistDraftRecord(baseRecord, payload);

  const whereStr = persisted?.where || `messageid='${safeSqlValue(messageId)}'`;
  const messageType = normalizeMessageType(baseRecord.message_type);
  const messageBody = buildMessageBody(baseRecord);

  if (!messageBody) {
    throw new Error('Message details are empty. Add message content before sending.');
  }

  const sendSmsNow = shouldSendSms(messageType, baseRecord.receiver_tel);
  const sendEmailNow = shouldSendEmail(messageType, baseRecord.receiver_email);

  if (!sendSmsNow && !sendEmailNow) {
    throw new Error('No valid recipient channel found. Add receiver tel/email and message type.');
  }

  const smsResult = sendSmsNow
    ? await mosySendSMS(baseRecord.receiver_tel, messageBody)
    : { status: 'skipped', message: 'SMS not requested' };

  const emailResult = sendEmailNow
    ? await mosySendEmail(baseRecord.receiver_email, baseRecord.subject || 'Message', messageBody)
    : { status: 'skipped', message: 'Email not requested' };

  const anyAttempted = sendSmsNow || sendEmailNow;
  const anyFailed =
    (sendSmsNow && smsResult?.status !== 'success') ||
    (sendEmailNow && emailResult?.status !== 'success');

  const sentState = anyAttempted && !anyFailed ? 'sent' : 'failed';
  const currentSendTypeLabel = toMessageTypeLabel({
    sms: sendSmsNow,
    email: sendEmailNow
  });
  const persistedMessageType =
    mergeMessageTypeLabels(existingMessageType, currentSendTypeLabel) || currentSendTypeLabel;

  const metrics = estimateSmsMetrics(messageBody, payload?.sms_cost);

  await updateSentState(whereStr, {
    sent_state: sentState,
    message_type: persistedMessageType,
    message_date: mosyRightNow(),
    page_count: metrics.pageCount,
    sms_cost: metrics.smsCost
  });

  return {
    success: !anyFailed,
    message: !anyFailed ? 'Message sent successfully' : 'Message send partially failed',
    data: {
      force_resend: forceResend,
      messageid: messageId,
      sent_state: sentState,
      message_type: persistedMessageType,
      sms: smsResult,
      email: emailResult,
      page_count: metrics.pageCount,
      sms_cost: metrics.smsCost
    }
  };
}

async function executeWhatsAppShare({ auth, payload }) {
  const messageId = safeText(payload?.messageid || payload?.NodeId) || magicRandomStr(7);
  const existingMessageType = await getExistingMessageType({ payload, messageId });

  const baseRecord = buildBaseMessageRecord({ auth, payload, messageId });
  const persisted = await persistDraftRecord(baseRecord, payload);
  const whereStr = persisted?.where || `messageid='${safeSqlValue(messageId)}'`;

  const mergedMessageType = mergeMessageTypeLabels(existingMessageType, 'whatsapp') || 'WhatsApp';

  await updateSentState(whereStr, {
    message_type: mergedMessageType,
    message_date: mosyRightNow()
  });

  return {
    success: true,
    message: 'WhatsApp share tracked successfully',
    data: {
      messageid: messageId,
      message_type: mergedMessageType
    }
  };
}

export async function resendMessage({ auth, payload }) {
  try {
    return await executeSend({ auth, payload, forceResend: true });
  } catch (error) {
    console.error('Error in resendMessage:', error);
    return {
      success: false,
      message: error?.message || 'Resend operation failed',
      data: null
    };
  }
}

export async function sendMessage({ auth, payload }) {
  try {
    return await executeSend({ auth, payload, forceResend: false });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return {
      success: false,
      message: error?.message || 'Send operation failed',
      data: null
    };
  }
}

export async function shareWhatsAppMessage({ auth, payload }) {
  try {
    return await executeWhatsAppShare({ auth, payload });
  } catch (error) {
    console.error('Error in shareWhatsAppMessage:', error);
    return {
      success: false,
      message: error?.message || 'WhatsApp share tracking failed',
      data: null
    };
  }
}
