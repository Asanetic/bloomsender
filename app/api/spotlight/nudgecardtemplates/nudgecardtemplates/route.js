
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { NudgecardtemplatesBatchMutations } from './NudgecardtemplatesBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddNudgecardtemplates, UpdateNudgecardtemplates } from './NudgecardtemplatesDbGateway';

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
      table: 'nudge_card_templates',
      source: 'Nudgecardtemplates',
      action : 'select',
      role: 'view_nudge_card_templates',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // nudge_card_templates column DictionaryMap
  const NudgecardtemplatesColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    templateName : "template_name", 
    templateType : "template_type", 
    htmlContent : "html_content", 
    cssContent : "css_content", 
    status : "status", 
    createdAt : "created_at", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `nudge_card_templates`,
      recordIdColumn: `record_id`,
      dictionary: NudgecardtemplatesColumnDictionary,
      searchParams,
      authData,
      batchMutations: NudgecardtemplatesBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Nudgecardtemplates data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Nudgecardtemplates failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(NudgecardtemplatesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = NudgecardtemplatesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await NudgecardtemplatesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await NudgecardtemplatesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(NudgecardtemplatesRequest);
     
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
      table: 'nudge_card_templates',
      source: 'Nudgecardtemplates',
      action : 'create',
      role: 'manage_nudge_card_templates',
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

		
  
  //--- Begin  nudge_card_templates inputs array ---// 
  const NudgecardtemplatesInputsArr = {

    "template_name" : "?", 
    "template_type" : "?", 
    "html_content" : "?", 
    "css_content" : "?", 
    "status" : "?", 
    "created_at" : "?", 

  };

  //--- End nudge_card_templates inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('nudge_card_templates',NudgecardtemplatesInputsArr, NudgecardtemplatesRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Nudgecardtemplates
      const result = await AddNudgecardtemplates(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        nudge_card_templates_dataNode: result.record_id
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

export async function PUT(NudgecardtemplatesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = NudgecardtemplatesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await NudgecardtemplatesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await NudgecardtemplatesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(NudgecardtemplatesRequest);
     
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
      table: 'nudge_card_templates',
      source: 'Nudgecardtemplates',
      action : 'update',
      role: 'manage_nudge_card_templates',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const NudgecardtemplatesFormAction = body.nudge_card_templates_mosy_action;
    const nudge_card_templates_dataNode_value = base64Decode(body.nudge_card_templates_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  nudge_card_templates inputs array ---// 
  const NudgecardtemplatesInputsArr = {

    "template_name" : "?", 
    "template_type" : "?", 
    "html_content" : "?", 
    "css_content" : "?", 
    "status" : "?", 
    "created_at" : "?", 

  };

  //--- End nudge_card_templates inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('nudge_card_templates',NudgecardtemplatesInputsArr, NudgecardtemplatesRequest, newId, authData)
       
      // update table Nudgecardtemplates
      const result = await UpdateNudgecardtemplates(newId, mutatedDataArray, body, authData, `primkey='${nudge_card_templates_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        nudge_card_templates_dataNode: nudge_card_templates_dataNode_value
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


