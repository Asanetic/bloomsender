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
export async function insertMessageoutbox() {
 //console.log(`Form messaging insert sent `)

  return await mosyPostFormData({
    formId: 'messaging_profile_form',
    url: apiRoutes.messageoutbox.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateMessageoutbox() {

  //console.log(`Form messaging update sent `)

  return await mosyPostFormData({
    formId: 'messaging_profile_form',
    url: apiRoutes.messageoutbox.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateMessageoutboxFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('messaging_mosy_action');
 
 //console.log(`Form messaging submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_messaging') {

      actionMessage ='Record added succesfully!';

      result = await insertMessageoutbox();
    }

    if (actionType === 'update_messaging') {

      actionMessage ='Record updated succesfully!';

      result = await updateMessageoutbox();
    }

    if (result?.status === 'success') {
      
      const messagingUptoken = btoa(result.messaging_dataNode || '');

      //set id key
      setters.setMessageoutboxUptoken(messagingUptoken);
      
      //update url with new messagingUptoken
      mosyUpdateUrlParam('messaging_dataNode', messagingUptoken)

      setters.setMessageoutboxActionStatus('update_messaging')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: messagingUptoken,
        actionName : actionType,
        actionType : 'messaging_form_submission'
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


export async function initMessageoutboxProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Message Outbox' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.messageoutbox.base,
      params: { 
      ...rawQstr,
      src : btoa(`initMessageoutboxProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('messages Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching messages data:', response.message);  // Handle error
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


export async function DeleteMessageoutbox(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.messageoutbox.delete,
        params: { 
          _messaging_delete_record: (token), 
          },
      });

      console.log('Token DeleteMessageoutbox '+token)
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


export async function getMessageoutboxListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qmessaging_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.messageoutbox.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getMessageoutboxListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('messages Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching messages data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadMessageoutboxListData(customQueryStr, setters) {

    const gftMessageoutbox = MosySecureFilterEngine('messaging');
    let finalFilterStr = (gftMessageoutbox);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setMessageoutboxLoading(true);
    
    const messageoutboxListData = await getMessageoutboxListData(finalFilterStr);
    
    setters.setMessageoutboxLoading(false)
    setters.setMessageoutboxListData(messageoutboxListData?.data)

    setters.setMessageoutboxListPageCount(messageoutboxListData?.pagination?.page_count)


    return messageoutboxListData

}
  
  
export async function messageoutboxProfileData(customQueryStr, setters, router, customProfileData={}) {

    const messageoutboxTokenId = mosyUrlParam('messaging_dataNode');
    
    const deleteParam = mosyUrlParam('messaging_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedMessageoutboxToken = '0';
    if (messageoutboxTokenId) {
      
      decodedMessageoutboxToken = atob(messageoutboxTokenId); // Decode the record_id
      setters.setMessageoutboxUptoken(messageoutboxTokenId);
      setters.setMessageoutboxActionStatus('update_messaging');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawMessageoutboxQueryStr ={Node:btoa(decodedMessageoutboxToken)}
    if(customQueryStr!='')
    {
      // if no messaging_dataNode set , use customQueryStr
      if (!messageoutboxTokenId) {
       rawMessageoutboxQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initMessageoutboxProfileData(rawMessageoutboxQueryStr)

    if(deleteParam){
      popDeleteDialog(messageoutboxTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setMessageoutboxNode(finalProfileData)
    
    
}
  
  

export function InteprateMessageoutboxEvent(data) {
     
  //console.log(' Messageoutbox Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_messaging){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('MessageoutboxProfileTray')

    
    mosyUpdateUrlParam('messaging_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setMessageoutboxCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('MessageoutboxProfileTray')

    
    mosyUpdateUrlParam('messaging_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_messaging){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add messaging `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('MessageoutboxProfileTray')
      }
    }
     
  }

  if(childActionName.update_messaging){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update messaging `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('MessageoutboxProfileTray')
        
      }
    }
  }

  if(childActionName.delete_messaging){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../messages/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteMessageoutbox(deleteToken).then(response=>{
  
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
       deleteUrlParam('messaging_delete');
        
    }
  
  });

}