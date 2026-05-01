'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
//access control
import {MosyAccessControl} from "../../UiControl/MosyAccessControl"
import {MosyUIGuard } from "../../UiControl/MosyUiGuard"


//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';
import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam ,mosyTonum  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateNudgecardtemplatesFormAction, nudgecardtemplatesProfileData , popDeleteDialog, InteprateNudgecardtemplatesEvent } from '../dataControl/NudgecardtemplatesRequestHandler';

//state management
import { useNudgecardtemplatesState } from '../dataControl/NudgecardtemplatesStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  DeleteButton ,
  MosyImageViewer,
  MosyFileUploadButton
} from '../../UiControl/componentControl';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();


// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════


// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_NUDGE_CARD_TEMPLATES";

//live data detial / profile component

export default function NudgecardtemplatesProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="NudgecardtemplatesMainProfilePage",
    parentProfileItemId = "NudgecardtemplatesProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Nudgecardtemplates states
  const [stateItem, stateItemSetters] = useNudgecardtemplatesState(settersOverrides);
  const nudge_card_templatesNode = stateItem.nudgecardtemplatesNode
  
  // -- basic states --//
  const paramNudgecardtemplatesUptoken  = stateItem.nudgecardtemplatesUptoken
  const nudgecardtemplatesActionStatus = stateItem.nudgecardtemplatesActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setNudgecardtemplatesNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postNudgecardtemplatesFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateNudgecardtemplatesFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postNudgecardtemplatesFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("NudgecardtemplatesProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    nudgecardtemplatesProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="NudgecardtemplatesProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postNudgecardtemplatesFormData} encType="multipart/form-data" id="nudge_card_templates_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {nudge_card_templatesNode?.primkey ? (  <span>{`Template Profile / ${nudge_card_templatesNode?.template_name}`}</span> ) :(<span> New Template</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramNudgecardtemplatesUptoken && (
                  <DeleteButton
                  src="NudgecardtemplatesMainProfilePage"
                  tableName="nudge_card_templates"
                  uptoken={paramNudgecardtemplatesUptoken}
                  stateItemSetters={stateItemSetters}
                  parentStateSetters={parentStateSetters}
                  
                  onDelete={popDeleteDialog}
                  />
                )}
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <><div className="row justify-content-end m-0 p-0 col-md-12  p-3  hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                {showNavigationIsle && (
                  <>
                  <Link href={backToList} className="text-info hive_profile_nav_back_to_list "><i className="fa fa-arrow-left"></i> Back to list</Link>
                </>
              )}
              
            </div>
            <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
              
              
              
              {paramNudgecardtemplatesUptoken && (
                <>
                
              </>
            )}
            
            {paramNudgecardtemplatesUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="NudgecardtemplatesMainProfilePage"
              tableName="nudge_card_templates"
              uptoken={paramNudgecardtemplatesUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="NudgecardtemplatesMainProfilePage"
              tableName="nudge_card_templates"
              link="./profile"
              label="New Template"
              icon="layout" />
            </>
          )}
          
        </div>
      </div></>
      <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
      {/*    Navigation isle      */}
      <div className="row justify-content-center m-0 p-0 col-md-12" id="">
        {/*    Image section isle      */}
        
        {/*    Image section isle      */}
        
        {/*  //-------------    main content starts here  ------------------------------ */}
        
        
        
        <div className="col-md-12 row justify-content-center m-0  p-0">
          {/*    Input cells section isle      */}
          <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Template Details</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="nudge_card_templates"
                field="template_name"
                label="Template Name"
                value={nudge_card_templatesNode?.template_name || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >Template Type</label>
                  
                  <select name="template_type" id="template_type" className="form-control">
                    <option  value={nudge_card_templatesNode?.template_type || ""}>{nudge_card_templatesNode?.template_type || "Select Template Type"}</option>
                    <option>promo</option>
                    <option>reminder</option>
                    <option>alert</option>
                    <option>custom</option>
                    
                  </select>
                </div>
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >Status</label>
                  
                  <select name="status" id="status" className="form-control">
                    <option  value={nudge_card_templatesNode?.status || ""}>{nudge_card_templatesNode?.status || "Select Status"}</option>
                    <option>active</option>
                    <option>inactive</option>
                    
                  </select>
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Design Content</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <div className="form-group col-md-12 hive_data_cell">
                  <label >Html Content</label>
                  <MosyHtmlEditor
                  key={`reload - ${nudge_card_templatesNode?.primkey}`}
                  module="nudge_card_templates"
                  field="html_content"
                  label="Html Content"
                  value={nudge_card_templatesNode?.html_content || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="content_editable"
                  cellOverrides={{additionalClass: "d-none"}}
                  
                  />
                  <div className="col-md-12  p-0 m-0 ck_raw_content d-none"  id="html_content_toprint">{nudge_card_templatesNode?.html_content || ""}</div>
                  
                </div>
                
                
                <MosySmartField
                module="nudge_card_templates"
                field="css_content"
                label="Css Content"
                value={nudge_card_templatesNode?.css_content || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="textarea"
                cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                />
                
              </div>
              
            </div>
            
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">System Information</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="nudge_card_templates"
                field="created_at"
                label="Created Date"
                value={nudge_card_templatesNode?.created_at || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="datetime-local"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
              </div>
              
              <div className="col-md-12 text-center">
                <SubmitButtons
                src="NudgecardtemplatesMainProfilePage"
                tblName="nudge_card_templates"
                extraClass="optional-custom-class"
                
                />
              </div>
            </div></div>
            {/*    Input cells section isle      */}
          </div>
          
          <section className="hive_control">
            <input type="hidden" id="nudge_card_templates_dataNode" name="nudge_card_templates_dataNode" value={paramNudgecardtemplatesUptoken}/>
            <input type="hidden" id="nudge_card_templates_mosy_action" name="nudge_card_templates_mosy_action" value={nudgecardtemplatesActionStatus}/>
          </section>
          
          
        </div>
        
      </form>
      
      
      <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
        {/*<hive_mini_list/>*/}
        
        
      </div>
    </div>
  </div>
  
  
  {/* snack notifications -- */}
  {snackMessage &&(
    <MosySnackWidget
    content={snackMessage}
    duration={5000}
    type="custom"
    onDone={() => {
      stateItemSetters.setSnackMessage("");
      stateItem.snackOnDone(); // Run whats inside onDone
      deleteUrlParam("snack_alert")
    }}
    
    />)}
    {/* snack notifications -- */}
    
    
    {/* ================== End Feature Section========================== ------*/}
  </div>
  
);

}

