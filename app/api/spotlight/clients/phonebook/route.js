
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { PhonebookBatchMutations } from './PhonebookBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddPhonebook, UpdatePhonebook } from './PhonebookDbGateway';

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
      table: 'clients',
      source: 'Phonebook',
      action : 'select',
      role: 'view_clients',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // clients column DictionaryMap
  const PhonebookColumnDictionary={

    Node : "primkey", 
    NodeId : "client_id", 
    clientName : "client_name", 
    clientEmail : "client_email", 
    clientTel : "client_tel", 
    clientLocation : "client_location", 
    gender : "gender", 
    dateRegistered : "date_registered", 
    clientPhoto : "client_photo", 
    password : "password", 
    adminId : "admin_id", 
    industry : "industry", 
    status : "status", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `clients`,
      recordIdColumn: `client_id`,
      dictionary: PhonebookColumnDictionary,
      searchParams,
      authData,
      batchMutations: PhonebookBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Phonebook data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Phonebook failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(PhonebookRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = PhonebookRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await PhonebookRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await PhonebookRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(PhonebookRequest);
     
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
      table: 'clients',
      source: 'Phonebook',
      action : 'create',
      role: 'manage_clients',
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

		
  
  //--- Begin  clients inputs array ---// 
  const PhonebookInputsArr = {

    "client_name" : "?", 
    "client_email" : "?", 
    "client_tel" : "?", 
    "client_location" : "?", 
    "gender" : "?", 
    "date_registered" : "?", 
    "client_photo" : "?", 
    "password" : "?", 
    "admin_id" : "?", 
    "industry" : "?", 
    "status" : "?", 

  };

  //--- End clients inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('clients',PhonebookInputsArr, PhonebookRequest, newId, authData)

      
      mutatedDataArray.client_id = newId;
      
      // Insert into table Phonebook
      const result = await AddPhonebook(newId, mutatedDataArray, body, authData);     

       
                // Now handle the file upload for client_photo, if any
                if (body.fileclients_client_photo) {
                  if(body["fileclients_client_photo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "fileclients_client_photo"], "media/clients");
                    
                    PhonebookInputsArr.client_photo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdatePhonebook(newId, { client_photo: filePath }, body, authData,  `primkey='${result.record_id}'`)
                    
                    let fileToDelete = body.media_clients_client_photo;
                      
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
        clients_dataNode: result.record_id
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

export async function PUT(PhonebookRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = PhonebookRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await PhonebookRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await PhonebookRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(PhonebookRequest);
     
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
      table: 'clients',
      source: 'Phonebook',
      action : 'update',
      role: 'manage_clients',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const PhonebookFormAction = body.clients_mosy_action;
    const clients_dataNode_value = base64Decode(body.clients_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  clients inputs array ---// 
  const PhonebookInputsArr = {

    "client_name" : "?", 
    "client_email" : "?", 
    "client_tel" : "?", 
    "client_location" : "?", 
    "gender" : "?", 
    "date_registered" : "?", 
    "client_photo" : "?", 
    "password" : "?", 
    "admin_id" : "?", 
    "industry" : "?", 
    "status" : "?", 

  };

  //--- End clients inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('clients',PhonebookInputsArr, PhonebookRequest, newId, authData)
       
      // update table Phonebook
      const result = await UpdatePhonebook(newId, mutatedDataArray, body, authData, `primkey='${clients_dataNode_value}'`)

      
                // Now handle the file upload for client_photo, if any
                if (body.fileclients_client_photo) {
                  if(body["fileclients_client_photo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "fileclients_client_photo"], "media/clients");
                    
                    PhonebookInputsArr.client_photo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdatePhonebook(newId, { client_photo: filePath }, body, authData,  `primkey='${clients_dataNode_value}'`)
                    
                    let fileToDelete = body.media_clients_client_photo;
                      
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
        clients_dataNode: clients_dataNode_value
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


