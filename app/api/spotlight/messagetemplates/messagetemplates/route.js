
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { MessagetemplatesBatchMutations } from './MessagetemplatesBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddMessagetemplates, UpdateMessagetemplates } from './MessagetemplatesDbGateway';

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
      table: 'message_templates',
      source: 'Messagetemplates',
      action : 'select',
      role: 'view_message_templates',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // message_templates column DictionaryMap
  const MessagetemplatesColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    templateName : "template_name", 
    messageSubject : "message_subject", 
    templateCode : "template_code", 
    messageTemplate : "message_template", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `message_templates`,
      recordIdColumn: `record_id`,
      dictionary: MessagetemplatesColumnDictionary,
      searchParams,
      authData,
      batchMutations: MessagetemplatesBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Messagetemplates data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Messagetemplates failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(MessagetemplatesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = MessagetemplatesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await MessagetemplatesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await MessagetemplatesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(MessagetemplatesRequest);
     
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
      table: 'message_templates',
      source: 'Messagetemplates',
      action : 'create',
      role: 'manage_message_templates',
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

		
  
  //--- Begin  message_templates inputs array ---// 
  const MessagetemplatesInputsArr = {

    "template_name" : "?", 
    "message_subject" : "?", 
    "template_code" : "?", 
    "message_template" : "?", 

  };

  //--- End message_templates inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('message_templates',MessagetemplatesInputsArr, MessagetemplatesRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Messagetemplates
      const result = await AddMessagetemplates(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        message_templates_dataNode: result.record_id
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

export async function PUT(MessagetemplatesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = MessagetemplatesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await MessagetemplatesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await MessagetemplatesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(MessagetemplatesRequest);
     
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
      table: 'message_templates',
      source: 'Messagetemplates',
      action : 'update',
      role: 'manage_message_templates',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const MessagetemplatesFormAction = body.message_templates_mosy_action;
    const message_templates_dataNode_value = base64Decode(body.message_templates_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  message_templates inputs array ---// 
  const MessagetemplatesInputsArr = {

    "template_name" : "?", 
    "message_subject" : "?", 
    "template_code" : "?", 
    "message_template" : "?", 

  };

  //--- End message_templates inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('message_templates',MessagetemplatesInputsArr, MessagetemplatesRequest, newId, authData)
       
      // update table Messagetemplates
      const result = await UpdateMessagetemplates(newId, mutatedDataArray, body, authData, `primkey='${message_templates_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        message_templates_dataNode: message_templates_dataNode_value
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


