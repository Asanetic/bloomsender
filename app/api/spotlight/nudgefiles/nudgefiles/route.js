
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { NudgefilesBatchMutations } from './NudgefilesBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddNudgefiles, UpdateNudgefiles } from './NudgefilesDbGateway';

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
      table: 'nudge_files',
      source: 'Nudgefiles',
      action : 'select',
      role: 'view_nudge_files',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // nudge_files column DictionaryMap
  const NudgefilesColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    title : "title", 
    content : "content", 
    createdAt : "created_at", 
    updatedAt : "updated_at", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `nudge_files`,
      recordIdColumn: `record_id`,
      dictionary: NudgefilesColumnDictionary,
      searchParams,
      authData,
      batchMutations: NudgefilesBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Nudgefiles data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Nudgefiles failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(NudgefilesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = NudgefilesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await NudgefilesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await NudgefilesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(NudgefilesRequest);
     
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
      table: 'nudge_files',
      source: 'Nudgefiles',
      action : 'create',
      role: 'manage_nudge_files',
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

		
  
  //--- Begin  nudge_files inputs array ---// 
  const NudgefilesInputsArr = {

    "title" : "?", 
    "content" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 

  };

  //--- End nudge_files inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('nudge_files',NudgefilesInputsArr, NudgefilesRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Nudgefiles
      const result = await AddNudgefiles(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        nudge_files_dataNode: result.record_id
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

export async function PUT(NudgefilesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = NudgefilesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await NudgefilesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await NudgefilesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(NudgefilesRequest);
     
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
      table: 'nudge_files',
      source: 'Nudgefiles',
      action : 'update',
      role: 'manage_nudge_files',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const NudgefilesFormAction = body.nudge_files_mosy_action;
    const nudge_files_dataNode_value = base64Decode(body.nudge_files_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  nudge_files inputs array ---// 
  const NudgefilesInputsArr = {

    "title" : "?", 
    "content" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 

  };

  //--- End nudge_files inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('nudge_files',NudgefilesInputsArr, NudgefilesRequest, newId, authData)
       
      // update table Nudgefiles
      const result = await UpdateNudgefiles(newId, mutatedDataArray, body, authData, `primkey='${nudge_files_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        nudge_files_dataNode: nudge_files_dataNode_value
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


