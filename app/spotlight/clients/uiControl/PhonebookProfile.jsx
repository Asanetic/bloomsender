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
import { intepratePhonebookFormAction, phonebookProfileData , popDeleteDialog, IntepratePhonebookEvent } from '../dataControl/PhonebookRequestHandler';

//state management
import { usePhonebookState } from '../dataControl/PhonebookStateManager';

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
export const MOSY_ACCESS_KEY = "MANAGE_CLIENTS";

//live data detial / profile component

export default function PhonebookProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="PhonebookMainProfilePage",
    parentProfileItemId = "PhonebookProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Phonebook states
  const [stateItem, stateItemSetters] = usePhonebookState(settersOverrides);
  const clientsNode = stateItem.phonebookNode
  
  // -- basic states --//
  const paramPhonebookUptoken  = stateItem.phonebookUptoken
  const phonebookActionStatus = stateItem.phonebookActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setPhonebookNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postPhonebookFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    intepratePhonebookFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postPhonebookFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("PhonebookProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    phonebookProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
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
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="PhonebookProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <div className="col-md-12 p-0 m-0 elforge_userprofile_template_v1_wrapper">
            
            <form onSubmit={postPhonebookFormData} encType="multipart/form-data" id="clients_profile_form">
              
              <div className="row col-md-12 justify-content-center p-0 m-0">
                
                <div className="col-md-12 mb-2 p-lg-0 pt-3 border-bottom border_set">
                  
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
                    
                    
                    
                    {paramPhonebookUptoken && (
                      <>
                      
                    </>
                  )}
                  
                  {paramPhonebookUptoken && showNavigationIsle && (
                    <>
                    
                    <DeleteButton
                    src="PhonebookMainProfilePage"
                    tableName="clients"
                    uptoken={paramPhonebookUptoken}
                    stateItemSetters={stateItemSetters}
                    parentStateSetters={parentStateSetters}
                    router={router}
                    onDelete={popDeleteDialog}
                    />
                    
                    
                    <AddNewButton
                    src="PhonebookMainProfilePage"
                    tableName="clients"
                    link="./profile"
                    label="New Client"
                    icon="user-plus" />
                  </>
                )}
                
              </div>
            </div></>
            <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
            {/*    Navigation isle      */}
          </div>
          
          
          {/* LEFT PROFILE COLUMN */}
          
          <div className="col-md-3 mr-lg-3 pt-lg-5">
            
            <div className="mt-5 text-center col-md-12 p-0 m-0  ">
              
              {/*    Image section isle      */}
              
              <div className="col-md-6 mr-lg-5">
                
                <div className="col-md-12 p-0 text-center mb-3">
                  
                  <MosyImageViewer
                  media={`/api/mediaroom?media=${btoa((clientsNode?.client_photo || ""))}`}
                  mediaRoot={""}
                  defaultLogo={logo.src}
                  imageClass="elforge_userprofile_template_v1_avatarWrap"
                  />
                  
                  <div className="elforge_message_profile_v2_upload_btn_mini">
                    <MosyFileUploadButton
                    tblName="clients"
                    attribute="client_photo"
                    />
                  </div>
                  <input type="hidden" name="media_clients_client_photo" value={clientsNode?.client_photo || ""}/>
                </div>
                
                
              </div>
              {/*    Image section isle      */}
              
              {/*  //-------------    main content starts here  ------------------------------ */}
              
            </div>
            
            <h4 className="text-left col-md-12 border-bottom pb-2">
              {clientsNode?.client_name}
            </h4>
            
            
            {/* Premium Data Nodes */}
            
            <div className="elforge_userprofile_template_v1_profile_nodes col-md-12">
              
              <div className="elforge_userprofile_template_v1_profile_node">
                <span className="elforge_userprofile_template_v1_node_label">Client email</span>
                <span className="elforge_userprofile_template_v1_node_value">{clientsNode?.client_email}</span>
              </div>
              
              <div className="elforge_userprofile_template_v1_profile_node">
                <span className="elforge_userprofile_template_v1_node_label">Client location</span>
                <span className="elforge_userprofile_template_v1_node_value">{clientsNode?.client_location}</span>
              </div>
              
              <div className="elforge_userprofile_template_v1_profile_node">
                <span className="elforge_userprofile_template_v1_node_label">{'label:data5'}</span>
                <span className="elforge_userprofile_template_v1_node_value">{'data5'}</span>
              </div>
              
              <div className="elforge_userprofile_template_v1_profile_node">
                <span className="elforge_userprofile_template_v1_node_label">{'label:data6'}</span>
                <span className="elforge_userprofile_template_v1_node_value">{'data6'}</span>
              </div>
              
            </div>
            
          </div>
          
          
          {/* RIGHT FORM COLUMN */}
          
          <div className="col-md-8 p-lg-0 m-0">
            
            <h4 className="col-md-12 py-4 px-lg-3">
              <div className="col-md-12 pl-3">
                {clientsNode?.primkey ? (  <span>{`Client Profile / ${clientsNode?.client_name}`}</span> ) :(<span> New Client</span>)}
              </div>
            </h4>
            
            
            
            
            <div className="col-md-12 row justify-content-center m-0  p-0">
              {/*    Input cells section isle      */}
              <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                  <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                    <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                    <div className="col-md-5 text-center">Client Information</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-start col-md-12 p-0 m-0 ">
                    
                    <MosySmartField
                    module="clients"
                    field="client_name"
                    label="Full Name"
                    value={clientsNode?.client_name || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="clients"
                    field="client_email"
                    label="Client Email"
                    value={clientsNode?.client_email || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="clients"
                    field="client_tel"
                    label="Phone Number"
                    value={clientsNode?.client_tel || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="clients"
                    field="client_location"
                    label="Client Location"
                    value={clientsNode?.client_location || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <div className="form-group col-md-4 hive_data_cell ">
                      <label >Gender</label>
                      
                      <select name="gender" id="gender" className="form-control">
                        <option  value={clientsNode?.gender || ""}>{clientsNode?.gender || "Select Gender"}</option>
                        <option>Male</option>
                        <option>Female</option>
                        
                      </select>
                    </div>
                    
                  </div>
                  
                </div>
                
                <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                  <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                    <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                    <div className="col-md-5 text-center">Account Settings</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-start col-md-12 p-0 m-0 ">
                    
                    <MosySmartField
                    module="clients"
                    field="password"
                    label="Password"
                    value={clientsNode?.password || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="password"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
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
                    module="clients"
                    field="date_registered"
                    label="Registration Date"
                    value={clientsNode?.date_registered || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="date"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                  </div>
                  
                </div>
                
                <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                  <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                    <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                    <div className="col-md-5 text-center"></div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-start col-md-12 p-0 m-0 ">
                    
                    <MosySmartField
                    module="clients"
                    field="admin_id"
                    label="Admin Id"
                    value={clientsNode?.admin_id || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="clients"
                    field="industry"
                    label="Industry"
                    value={clientsNode?.industry || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="clients"
                    field="status"
                    label="Status"
                    value={clientsNode?.status || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons
                    src="PhonebookMainProfilePage"
                    tblName="clients"
                    extraClass="optional-custom-class"
                    
                    />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="clients_dataNode" name="clients_dataNode" value={paramPhonebookUptoken}/>
                <input type="hidden" id="clients_mosy_action" name="clients_mosy_action" value={phonebookActionStatus}/>
              </section>
              
              
              
            </div>
            
          </div>
          
        </form>
        
        
        <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
          {/*<hive_mini_list/>*/}
          
          
        </div>
        
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

