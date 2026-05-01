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
export async function insertNudgecardtemplates() {
 //console.log(`Form nudge_card_templates insert sent `)

  return await mosyPostFormData({
    formId: 'nudge_card_templates_profile_form',
    url: apiRoutes.nudgecardtemplates.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateNudgecardtemplates() {

  //console.log(`Form nudge_card_templates update sent `)

  return await mosyPostFormData({
    formId: 'nudge_card_templates_profile_form',
    url: apiRoutes.nudgecardtemplates.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateNudgecardtemplatesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('nudge_card_templates_mosy_action');
 
 //console.log(`Form nudge_card_templates submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_nudge_card_templates') {

      actionMessage ='Record added succesfully!';

      result = await insertNudgecardtemplates();
    }

    if (actionType === 'update_nudge_card_templates') {

      actionMessage ='Record updated succesfully!';

      result = await updateNudgecardtemplates();
    }

    if (result?.status === 'success') {
      
      const nudge_card_templatesUptoken = btoa(result.nudge_card_templates_dataNode || '');

      //set id key
      setters.setNudgecardtemplatesUptoken(nudge_card_templatesUptoken);
      
      //update url with new nudge_card_templatesUptoken
      mosyUpdateUrlParam('nudge_card_templates_dataNode', nudge_card_templatesUptoken)

      setters.setNudgecardtemplatesActionStatus('update_nudge_card_templates')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: nudge_card_templatesUptoken,
        actionName : actionType,
        actionType : 'nudge_card_templates_form_submission'
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


export async function initNudgecardtemplatesProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Nudge Card Templates' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.nudgecardtemplates.base,
      params: { 
      ...rawQstr,
      src : btoa(`initNudgecardtemplatesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('nudgecardtemplates Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching nudgecardtemplates data:', response.message);  // Handle error
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


export async function DeleteNudgecardtemplates(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.nudgecardtemplates.delete,
        params: { 
          _nudge_card_templates_delete_record: (token), 
          },
      });

      console.log('Token DeleteNudgecardtemplates '+token)
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


export async function getNudgecardtemplatesListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qnudge_card_templates_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.nudgecardtemplates.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getNudgecardtemplatesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('nudgecardtemplates Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching nudgecardtemplates data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadNudgecardtemplatesListData(customQueryStr, setters) {

    const gftNudgecardtemplates = MosySecureFilterEngine('nudge_card_templates');
    let finalFilterStr = (gftNudgecardtemplates);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setNudgecardtemplatesLoading(true);
    
    const nudgecardtemplatesListData = await getNudgecardtemplatesListData(finalFilterStr);
    
    setters.setNudgecardtemplatesLoading(false)
    setters.setNudgecardtemplatesListData(nudgecardtemplatesListData?.data)

    setters.setNudgecardtemplatesListPageCount(nudgecardtemplatesListData?.pagination?.page_count)


    return nudgecardtemplatesListData

}
  
  
export async function nudgecardtemplatesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const nudgecardtemplatesTokenId = mosyUrlParam('nudge_card_templates_dataNode');
    
    const deleteParam = mosyUrlParam('nudge_card_templates_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedNudgecardtemplatesToken = '0';
    if (nudgecardtemplatesTokenId) {
      
      decodedNudgecardtemplatesToken = atob(nudgecardtemplatesTokenId); // Decode the record_id
      setters.setNudgecardtemplatesUptoken(nudgecardtemplatesTokenId);
      setters.setNudgecardtemplatesActionStatus('update_nudge_card_templates');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawNudgecardtemplatesQueryStr ={Node:btoa(decodedNudgecardtemplatesToken)}
    if(customQueryStr!='')
    {
      // if no nudge_card_templates_dataNode set , use customQueryStr
      if (!nudgecardtemplatesTokenId) {
       rawNudgecardtemplatesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initNudgecardtemplatesProfileData(rawNudgecardtemplatesQueryStr)

    if(deleteParam){
      popDeleteDialog(nudgecardtemplatesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setNudgecardtemplatesNode(finalProfileData)
    
    
}
  
  

export function InteprateNudgecardtemplatesEvent(data) {
     
  //console.log(' Nudgecardtemplates Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_nudge_card_templates){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('NudgecardtemplatesProfileTray')

    
    mosyUpdateUrlParam('nudge_card_templates_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setNudgecardtemplatesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('NudgecardtemplatesProfileTray')

    
    mosyUpdateUrlParam('nudge_card_templates_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_nudge_card_templates){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add nudge_card_templates `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('NudgecardtemplatesProfileTray')
      }
    }
     
  }

  if(childActionName.update_nudge_card_templates){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update nudge_card_templates `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('NudgecardtemplatesProfileTray')
        
      }
    }
  }

  if(childActionName.delete_nudge_card_templates){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../nudgecardtemplates/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteNudgecardtemplates(deleteToken).then(response=>{
  
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
       deleteUrlParam('nudge_card_templates_delete');
        
    }
  
  });

}