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
export async function insertNudgefiles() {
 //console.log(`Form nudge_files insert sent `)

  return await mosyPostFormData({
    formId: 'nudge_files_profile_form',
    url: apiRoutes.nudgefiles.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateNudgefiles() {

  //console.log(`Form nudge_files update sent `)

  return await mosyPostFormData({
    formId: 'nudge_files_profile_form',
    url: apiRoutes.nudgefiles.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateNudgefilesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('nudge_files_mosy_action');
 
 //console.log(`Form nudge_files submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_nudge_files') {

      actionMessage ='Record added succesfully!';

      result = await insertNudgefiles();
    }

    if (actionType === 'update_nudge_files') {

      actionMessage ='Record updated succesfully!';

      result = await updateNudgefiles();
    }

    if (result?.status === 'success') {
      
      const nudge_filesUptoken = btoa(result.nudge_files_dataNode || '');

      //set id key
      setters.setNudgefilesUptoken(nudge_filesUptoken);
      
      //update url with new nudge_filesUptoken
      mosyUpdateUrlParam('nudge_files_dataNode', nudge_filesUptoken)

      setters.setNudgefilesActionStatus('update_nudge_files')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: nudge_filesUptoken,
        actionName : actionType,
        actionType : 'nudge_files_form_submission'
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


export async function initNudgefilesProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Nudge Files' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.nudgefiles.base,
      params: { 
      ...rawQstr,
      src : btoa(`initNudgefilesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('nudgefiles Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching nudgefiles data:', response.message);  // Handle error
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


export async function DeleteNudgefiles(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.nudgefiles.delete,
        params: { 
          _nudge_files_delete_record: (token), 
          },
      });

      console.log('Token DeleteNudgefiles '+token)
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


export async function getNudgefilesListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qnudge_files_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.nudgefiles.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getNudgefilesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('nudgefiles Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching nudgefiles data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadNudgefilesListData(customQueryStr, setters) {

    const gftNudgefiles = MosySecureFilterEngine('nudge_files');
    let finalFilterStr = (gftNudgefiles);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setNudgefilesLoading(true);
    
    const nudgefilesListData = await getNudgefilesListData(finalFilterStr);
    
    setters.setNudgefilesLoading(false)
    setters.setNudgefilesListData(nudgefilesListData?.data)

    setters.setNudgefilesListPageCount(nudgefilesListData?.pagination?.page_count)


    return nudgefilesListData

}
  
  
export async function nudgefilesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const nudgefilesTokenId = mosyUrlParam('nudge_files_dataNode');
    
    const deleteParam = mosyUrlParam('nudge_files_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedNudgefilesToken = '0';
    if (nudgefilesTokenId) {
      
      decodedNudgefilesToken = atob(nudgefilesTokenId); // Decode the record_id
      setters.setNudgefilesUptoken(nudgefilesTokenId);
      setters.setNudgefilesActionStatus('update_nudge_files');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawNudgefilesQueryStr ={Node:btoa(decodedNudgefilesToken)}
    if(customQueryStr!='')
    {
      // if no nudge_files_dataNode set , use customQueryStr
      if (!nudgefilesTokenId) {
       rawNudgefilesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initNudgefilesProfileData(rawNudgefilesQueryStr)

    if(deleteParam){
      popDeleteDialog(nudgefilesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setNudgefilesNode(finalProfileData)
    
    
}
  
  

export function InteprateNudgefilesEvent(data) {
     
  //console.log(' Nudgefiles Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_nudge_files){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('NudgefilesProfileTray')

    
    mosyUpdateUrlParam('nudge_files_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setNudgefilesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('NudgefilesProfileTray')

    
    mosyUpdateUrlParam('nudge_files_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_nudge_files){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add nudge_files `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('NudgefilesProfileTray')
      }
    }
     
  }

  if(childActionName.update_nudge_files){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update nudge_files `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('NudgefilesProfileTray')
        
      }
    }
  }

  if(childActionName.delete_nudge_files){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../nudgefiles/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteNudgefiles(deleteToken).then(response=>{
  
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
       deleteUrlParam('nudge_files_delete');
        
    }
  
  });

}