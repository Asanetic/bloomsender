
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { NudgecardsBatchMutations } from './NudgecardsBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddNudgecards, UpdateNudgecards } from './NudgecardsDbGateway';

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
      table: 'nudge_cards',
      source: 'Nudgecards',
      action : 'select',
      role: 'view_nudge_cards',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // nudge_cards column DictionaryMap
  const NudgecardsColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    clientId : "client_id", 
    templateId : "template_id", 
    cardTitle : "card_title", 
    cardData : "card_data", 
    generatedImagePath : "generated_image_path", 
    status : "status", 
    createdAt : "created_at", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `nudge_cards`,
      recordIdColumn: `record_id`,
      dictionary: NudgecardsColumnDictionary,
      searchParams,
      authData,
      batchMutations: NudgecardsBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Nudgecards data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Nudgecards failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(NudgecardsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = NudgecardsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await NudgecardsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await NudgecardsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(NudgecardsRequest);
     
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
      table: 'nudge_cards',
      source: 'Nudgecards',
      action : 'create',
      role: 'manage_nudge_cards',
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

		
  
  //--- Begin  nudge_cards inputs array ---// 
  const NudgecardsInputsArr = {

    "client_id" : "?", 
    "template_id" : "?", 
    "card_title" : "?", 
    "card_data" : "?", 
    "generated_image_path" : "?", 
    "status" : "?", 
    "created_at" : "?", 

  };

  //--- End nudge_cards inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('nudge_cards',NudgecardsInputsArr, NudgecardsRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Nudgecards
      const result = await AddNudgecards(newId, mutatedDataArray, body, authData);     

       
                // Now handle the file upload for generated_image_path, if any
                if (body.filenudge_cards_generated_image_path) {
                  if(body["filenudge_cards_generated_image_path"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "filenudge_cards_generated_image_path"], "media/nudge_cards");
                    
                    NudgecardsInputsArr.generated_image_path = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateNudgecards(newId, { generated_image_path: filePath }, body, authData,  `primkey='${result.record_id}'`)
                    
                    let fileToDelete = body.media_nudge_cards_generated_image_path;
                      
                    //Delete file if need be

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        nudge_cards_dataNode: result.record_id
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

export async function PUT(NudgecardsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = NudgecardsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await NudgecardsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await NudgecardsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(NudgecardsRequest);
     
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
      table: 'nudge_cards',
      source: 'Nudgecards',
      action : 'update',
      role: 'manage_nudge_cards',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const NudgecardsFormAction = body.nudge_cards_mosy_action;
    const nudge_cards_dataNode_value = base64Decode(body.nudge_cards_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  nudge_cards inputs array ---// 
  const NudgecardsInputsArr = {

    "client_id" : "?", 
    "template_id" : "?", 
    "card_title" : "?", 
    "card_data" : "?", 
    "generated_image_path" : "?", 
    "status" : "?", 
    "created_at" : "?", 

  };

  //--- End nudge_cards inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('nudge_cards',NudgecardsInputsArr, NudgecardsRequest, newId, authData)
       
      // update table Nudgecards
      const result = await UpdateNudgecards(newId, mutatedDataArray, body, authData, `primkey='${nudge_cards_dataNode_value}'`)

      
                // Now handle the file upload for generated_image_path, if any
                if (body.filenudge_cards_generated_image_path) {
                  if(body["filenudge_cards_generated_image_path"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "filenudge_cards_generated_image_path"], "media/nudge_cards");
                    
                    NudgecardsInputsArr.generated_image_path = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateNudgecards(newId, { generated_image_path: filePath }, body, authData,  `primkey='${nudge_cards_dataNode_value}'`)
                    
                    let fileToDelete = body.media_nudge_cards_generated_image_path;
                      
                    //Delete old file
mosyDeleteFile(fileToDelete);
// Log or store deleted file: fileToDelete

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        nudge_cards_dataNode: nudge_cards_dataNode_value
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


