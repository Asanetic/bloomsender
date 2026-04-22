/**
 * FILE: messaging-actions.jsx
 * PURPOSE: Frontend logic functions for messaging-actions
 */

import { closeMosyCard } from '../../../components/MosyCard';
import { MosyAlertCard, MosyNotify } from '../../../MosyUtils/ActionModals';
import { mosyPostData , mosy_push_data ,mosyScrollTo, mosyGetElemVal, magicTrimText} from '../../../MosyUtils/hiveUtils';
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';
import {MosyLiveSearch} from "../../UiControl/customUI";

const apiRoutes = getApiRoutes();

function buildMessagePayload(messageData = {}) {
  const payload = {};
  const form = document.getElementById('messaging_profile_form');

  if (form) {
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      payload[key] = typeof value === 'string' ? value.trim() : value;
    }
  }

  if (typeof messageData === 'string' && messageData) {
    payload.messageid = messageData;
  }

  if (messageData && typeof messageData === 'object') {
    Object.assign(payload, messageData);
  }

  payload.trigger_source = 'messaging-actions.sendMessage';

  return payload;
}

async function postSmartSend(action, payload) {
  return await mosyPostData({
    url: apiRoutes.smartapi.base,
    data: {
      action,
      payload
    }
  });
}

export function resendMessage(messageData = {}) {
  const payload = buildMessagePayload(messageData);
  payload.force_resend = true;

  return sendMessage(payload, 'resendMessage');
}

export function sendMessage(messageData = {}, actionName = 'sendMessage') {
  mosyScrollTo("message_details");

  const payload = buildMessagePayload(messageData);

  if (!payload.messageid && !payload.messaging_dataNode) {
    MosyNotify({
      message: 'Save this message first before sending.',
      icon: 'times-circle',
      iconColor: 'text-danger'
    });

    return;
  }

  MosyAlertCard({
    icon: 'question-circle',
    iconColor: 'text-primary',
    message: 'Confirm send message?',
    yesLabel: 'Send',
    noLabel: 'Cancel',
    onYes: async () => {
      try {
        closeMosyCard()
        MosyNotify({
          message: 'Sending message...',
          icon: 'send',
          addTimer: false,
          id: 'modal1'
        });

        const response = await postSmartSend(actionName, payload);
        closeMosyCard('modal1')
        if (response?.status === 'success' && response?.data?.success !== false) {
          MosyNotify({
            message: response?.data?.message || 'Message sent successfully',
            icon: 'check-circle',
            iconColor: 'text-success'
          });

          setTimeout(() => {
            window.location.reload();
          }, 1200);

          return;
        }

        const errorMessage =
          response?.data?.message || response?.message || 'Failed to send message';

        MosyNotify({
          message: errorMessage,
          icon: 'times-circle',
          iconColor: 'text-danger'
        });
      } catch (error) {
        console.error('sendMessage error:', error);

        MosyNotify({
          message: error?.message || 'Failed to send message',
          icon: 'times-circle',
          iconColor: 'text-danger'
        });
      }
    }
  });
}

// ════════════════════════════════════════════════════════════════
// FUNCTION: loadTemplates
/* 
Function flow notes
 
how loadTemplates works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function loadTemplates() {
    // Implement loadTemplates logic here
    //alert("loadTemplates");

    MosyLiveSearch({
            api : apiRoutes.messagetemplates.base,
            tableName : "message_templates",
            displayField : "template_name",
            valueField : "template_name",
            actionName : "mosyfilter_",
            title : "Search templates",
            onSelectFull : (dataRes) => {
                // Call full payload regardless

                mosy_push_data("message_details", dataRes.message_template);
                mosyScrollTo("message_details");
                closeMosyCard()

            },

    })
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: whatsappShare
/* 
Function flow notes
 
how whatsappShare works 
Steps
*/
// ════════════════════════════════════════════════════════════════


export function whatsappShare() {
  const messageToSend = mosyGetElemVal("message_details", "");
  const receiver = mosyGetElemVal("receiver_tel", "");

  MosyAlertCard({
    message: `Send to ${receiver} \n ${magicTrimText(messageToSend, 100)}`,
    icon: "whatsapp",
    iconColor: "text-success",
    onYes: async () => {
      MosyNotify({
        message: "Sending message...",
        icon: "send",
        addTimer: false,
        id: "topmost"
      });

      openWhatsAppUrl(receiver, messageToSend); // ✅ Use this instead of <WhatsAppAutoOpen />
    },
    onNo: () => {
      closeMosyCard();
    },
    yesLabel: "Send",
    noLabel: "Cancel"
  });
}


export function openWhatsAppUrl(phone, message) {
  if (!phone || !message) return;

  let cleanedPhone = phone.trim();

  // Handle +254 numbers (keep the +)
  if (cleanedPhone.startsWith("+254")) {
    cleanedPhone = cleanedPhone.replace(/\s+/g, ""); // remove internal spaces
  }

  // Handle 07... -> convert to 2547...
  else if (cleanedPhone.startsWith("07")) {
    cleanedPhone = "254" + cleanedPhone.substring(1);
  }

  // Handle 254... without + (no change needed, just strip non-digits)
  else if (cleanedPhone.startsWith("254")) {
    cleanedPhone = cleanedPhone.replace(/\D/g, "");
  }

  // Handle + other international (keep as-is)
  else if (cleanedPhone.startsWith("+")) {
    cleanedPhone = cleanedPhone.replace(/\s+/g, "");
  }

  // Fallback: clean digits, maybe raise a log or warning
  else {
    cleanedPhone = cleanedPhone.replace(/\D/g, "");
  }

  const encodedMessage = encodeURIComponent(message);
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  const baseUrl = isMobile
    ? "https://api.whatsapp.com/send"
    : "https://web.whatsapp.com/send";

  // Strip + for wa.me format
  const whatsappPhone = cleanedPhone.startsWith("+")
    ? cleanedPhone.substring(1)
    : cleanedPhone;

  closeMosyCard("topmost");

  const url = `${baseUrl}?phone=${whatsappPhone}&text=${encodedMessage}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
