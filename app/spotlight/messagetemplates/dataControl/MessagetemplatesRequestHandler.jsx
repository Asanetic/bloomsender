'use client';
//hive / data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//action modals 
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//filter util
import { MosySecureFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

//routes manager
///handle routes 
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();

//insert data
export async function insertMessagetemplates() {
 //console.log(`Form message_templates insert sent `)

  return await mosyPostFormData({
    formId: 'message_templates_profile_form',
    url: apiRoutes.messagetemplates.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateMessagetemplates() {

  //console.log(`Form message_templates update sent `)

  return await mosyPostFormData({
    formId: 'message_templates_profile_form',
    url: apiRoutes.messagetemplates.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateMessagetemplatesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('message_templates_mosy_action');
 
 //console.log(`Form message_templates submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_message_templates') {

      actionMessage ='Record added succesfully!';

      result = await insertMessagetemplates();
    }

    if (actionType === 'update_message_templates') {

      actionMessage ='Record updated succesfully!';

      result = await updateMessagetemplates();
    }

    if (result?.status === 'success') {
      
      const message_templatesUptoken = btoa(result.message_templates_dataNode || '');

      //set id key
      setters.setMessagetemplatesUptoken(message_templatesUptoken);
      
      //update url with new message_templatesUptoken
      mosyUpdateUrlParam('message_templates_dataNode', message_templatesUptoken)

      setters.setMessagetemplatesActionStatus('update_message_templates')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: message_templatesUptoken,
        actionName : actionType,
        actionType : 'message_templates_form_submission'
      };
            
      
    } else {
      MosyNotify({message:result.message, icon:'times-circle', iconColor :'text-danger'})
      
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
    }

  } catch (error) {
    console.error('Form error:', error);
    
      MosyNotify({message:result.message, icon:'times-circle', iconColor :'text-danger'})
    
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
  } 
}


export async function initMessagetemplatesProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Message Templates' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.messagetemplates.base,
      params: { 
      ...rawQstr,
      src : btoa(`initMessagetemplatesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('messagetemplates Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching messagetemplates data:', response.message);  // Handle error
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteMessagetemplates(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.messagetemplates.delete,
        params: { 
          _message_templates_delete_record: (token), 
          },
      });

      console.log('Token DeleteMessagetemplates '+token)
      if (response.status === 'success') {

        closeMosyModal();

        return response; // Return the data
      } else {
        console.error('Error deleting systemusers data:', response.message);
        
        closeMosyModal();

        MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})

        return response; // Safe fallback
      }
    } catch (err) {
      console.error('Error:', err);
      closeMosyModal();
      
      return []; //  Even safer fallback
    }

}


export async function getMessagetemplatesListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qmessage_templates_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.messagetemplates.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getMessagetemplatesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('messagetemplates Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching messagetemplates data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadMessagetemplatesListData(customQueryStr, setters) {

    const gftMessagetemplates = MosySecureFilterEngine('message_templates');
    let finalFilterStr = (gftMessagetemplates);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setMessagetemplatesLoading(true);
    
    const messagetemplatesListData = await getMessagetemplatesListData(finalFilterStr);
    
    setters.setMessagetemplatesLoading(false)
    setters.setMessagetemplatesListData(messagetemplatesListData?.data)

    setters.setMessagetemplatesListPageCount(messagetemplatesListData?.pagination?.page_count)


    return messagetemplatesListData

}
  
  
export async function messagetemplatesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const messagetemplatesTokenId = mosyUrlParam('message_templates_dataNode');
    
    const deleteParam = mosyUrlParam('message_templates_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedMessagetemplatesToken = '0';
    if (messagetemplatesTokenId) {
      
      decodedMessagetemplatesToken = atob(messagetemplatesTokenId); // Decode the record_id
      setters.setMessagetemplatesUptoken(messagetemplatesTokenId);
      setters.setMessagetemplatesActionStatus('update_message_templates');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawMessagetemplatesQueryStr ={Node:btoa(decodedMessagetemplatesToken)}
    if(customQueryStr!='')
    {
      // if no message_templates_dataNode set , use customQueryStr
      if (!messagetemplatesTokenId) {
       rawMessagetemplatesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initMessagetemplatesProfileData(rawMessagetemplatesQueryStr)

    if(deleteParam){
      popDeleteDialog(messagetemplatesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setMessagetemplatesNode(finalProfileData)
    
    
}
  
  

export function InteprateMessagetemplatesEvent(data) {
     
  //console.log(' Messagetemplates Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_message_templates){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('MessagetemplatesProfileTray')

    
    mosyUpdateUrlParam('message_templates_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setMessagetemplatesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('MessagetemplatesProfileTray')

    
    mosyUpdateUrlParam('message_templates_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_message_templates){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add message_templates `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('MessagetemplatesProfileTray')
      }
    }
     
  }

  if(childActionName.update_message_templates){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update message_templates `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('MessagetemplatesProfileTray')
        
      }
    }
  }

  if(childActionName.delete_message_templates){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../messagetemplates/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteMessagetemplates(deleteToken).then(response=>{
  
        if(response.status!='error')
        {
          childSetters?.setSnackMessage("Record deleted succesfully!")
          childSetters?.setParentUseEffectKey(magicRandomStr());
          childSetters?.setLocalEventSignature(magicRandomStr());

          if(router){
            router.push(`${afterDeleteUrl}?snack_alert=Record Deleted successfully!`)
          }
       }
      })
  
    },
  
    onNo: () => {
  
      // Remove the param from the URL
       closeMosyModal()
       deleteUrlParam('message_templates_delete');
        
    }
  
  });

}