
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { MessageoutboxBatchMutations } from './MessageoutboxBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddMessageoutbox, UpdateMessageoutbox } from './MessageoutboxDbGateway';

export async function GET(request) {

  try {
    const { searchParams } = new URL(request.url);

    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canSelect = validateRoleAccess({
      table: 'messaging',
      source: 'Messageoutbox',
      action : 'select',
      role: 'view_messaging',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // messaging column DictionaryMap
  const MessageoutboxColumnDictionary={

    Node : "primkey", 
    NodeId : "messageid", 
    reciverNames : "reciver_names", 
    receiverEmail : "receiver_email", 
    receiverTel : "receiver_tel", 
    messageType : "message_type", 
    sentState : "sent_state", 
    messageDate : "message_date", 
    receiverContacts : "receiver_contacts", 
    siteId : "site_id", 
    groupName : "group_name", 
    msgReadState : "msg_read_state", 
    subject : "subject", 
    messageLabel : "message_label", 
    messageDetails : "message_details", 
    smsCost : "sms_cost", 
    pageCount : "page_count", 
    customDictionary : "custom_dictionary", 
    messageSignature : "message_signature", 
    refNumber : "ref_number", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `messaging`,
      recordIdColumn: `messageid`,
      dictionary: MessageoutboxColumnDictionary,
      searchParams,
      authData,
      batchMutations: MessageoutboxBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Messageoutbox data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Messageoutbox failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(MessageoutboxRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = MessageoutboxRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await MessageoutboxRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await MessageoutboxRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(MessageoutboxRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canPost = validateRoleAccess({
      table: 'messaging',
      source: 'Messageoutbox',
      action : 'create',
      role: 'manage_messaging',
      authData
    });

    if (!canPost.valid) {
      return Response.json({
        status: 'error',
        message: canPost.message,
        data: []
      });
    }
    
    //generate Record id 
    const newId = magicRandomStr(7);

		
  
  //--- Begin  messaging inputs array ---// 
  const MessageoutboxInputsArr = {

    "reciver_names" : "?", 
    "receiver_email" : "?", 
    "receiver_tel" : "?", 
    "message_type" : "?", 
    "sent_state" : "?", 
    "message_date" : "?", 
    "receiver_contacts" : "?", 
    "site_id" : "?", 
    "group_name" : "?", 
    "msg_read_state" : "?", 
    "subject" : "?", 
    "message_label" : "?", 
    "message_details" : "?", 
    "sms_cost" : "?", 
    "page_count" : "?", 
    "custom_dictionary" : "?", 
    "message_signature" : "?", 
    "ref_number" : "?", 

  };

  //--- End messaging inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('messaging',MessageoutboxInputsArr, MessageoutboxRequest, newId, authData)

      
      mutatedDataArray.messageid = newId;
      
      // Insert into table Messageoutbox
      const result = await AddMessageoutbox(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        messaging_dataNode: result.record_id
      });
      
    
 
  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(MessageoutboxRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = MessageoutboxRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await MessageoutboxRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await MessageoutboxRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(MessageoutboxRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canUpdate = validateRoleAccess({
      table: 'messaging',
      source: 'Messageoutbox',
      action : 'update',
      role: 'manage_messaging',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const MessageoutboxFormAction = body.messaging_mosy_action;
    const messaging_dataNode_value = base64Decode(body.messaging_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  messaging inputs array ---// 
  const MessageoutboxInputsArr = {

    "reciver_names" : "?", 
    "receiver_email" : "?", 
    "receiver_tel" : "?", 
    "message_type" : "?", 
    "sent_state" : "?", 
    "message_date" : "?", 
    "receiver_contacts" : "?", 
    "site_id" : "?", 
    "group_name" : "?", 
    "msg_read_state" : "?", 
    "subject" : "?", 
    "message_label" : "?", 
    "message_details" : "?", 
    "sms_cost" : "?", 
    "page_count" : "?", 
    "custom_dictionary" : "?", 
    "message_signature" : "?", 
    "ref_number" : "?", 

  };

  //--- End messaging inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('messaging',MessageoutboxInputsArr, MessageoutboxRequest, newId, authData)
       
      // update table Messageoutbox
      const result = await UpdateMessageoutbox(newId, mutatedDataArray, body, authData, `primkey='${messaging_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        messaging_dataNode: messaging_dataNode_value
      });
 

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}


