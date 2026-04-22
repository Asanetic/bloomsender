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
import { inteprateMessageoutboxFormAction, messageoutboxProfileData , popDeleteDialog, InteprateMessageoutboxEvent } from '../dataControl/MessageoutboxRequestHandler';

//state management
import { useMessageoutboxState } from '../dataControl/MessageoutboxStateManager';

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
  MosyFileUploadButton,
  getStringInitials
} from '../../UiControl/componentControl';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import { loadClient } from '../../AppCore/coreUtils';

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();

import MessageoutboxList from './MessageoutboxList';
// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from messaging-actions.jsx
import {
  sendMessage,
  loadTemplates,
  whatsappShare
} from '../logicControl/messaging-actions';



// export profile



///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_MESSAGING";

//live data detial / profile component

export default function MessageoutboxProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="MessageoutboxMainProfilePage",
    parentProfileItemId = "MessageoutboxProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Messageoutbox states
  const [stateItem, stateItemSetters] = useMessageoutboxState(settersOverrides);
  const messagingNode = stateItem.messageoutboxNode
  
  // -- basic states --//
  const paramMessageoutboxUptoken  = stateItem.messageoutboxUptoken
  const messageoutboxActionStatus = stateItem.messageoutboxActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setMessageoutboxNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postMessageoutboxFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateMessageoutboxFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postMessageoutboxFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("MessageoutboxProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    messageoutboxProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
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
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="MessageoutboxProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <div className="elforge_message_profile_v1_workspace container-fluid">
            <form onSubmit={postMessageoutboxFormData} encType="multipart/form-data" id="messaging_profile_form">
              
              {/* PROFILE HEADER */}
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
                  
                  
                  
                  {paramMessageoutboxUptoken && (
                    <>
                    
                    <MosyActionButton
                    label=" Send Message"
                    icon="paper-plane"
                    onClick={()=>{sendMessage(messagingNode?.messageid)}}
                    />
                    
                    <MosyActionButton
                    label=" Load templates"
                    icon="file-text"
                    onClick={()=>{loadTemplates()}}
                    />
                    
                    <MosyActionButton
                    label=" Share via whatsapp"
                    icon="whatsapp"
                    onClick={()=>{whatsappShare()}}
                    />
                    
                  </>
                )}
                
                {paramMessageoutboxUptoken && showNavigationIsle && (
                  <>
                  
                  <DeleteButton
                  src="MessageoutboxMainProfilePage"
                  tableName="messaging"
                  uptoken={paramMessageoutboxUptoken}
                  stateItemSetters={stateItemSetters}
                  parentStateSetters={parentStateSetters}
                  router={router}
                  onDelete={popDeleteDialog}
                  />
                  
                  
                  <AddNewButton
                  src="MessageoutboxMainProfilePage"
                  tableName="messaging"
                  link="./profile"
                  label="New Message"
                  icon="envelope" />
                </>
              )}
              
            </div>
          </div></>
          <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
          {/*    Navigation isle      */}
        </div>
        <div className="elforge_message_profile_v1_header">
          
          <div className="elforge_message_profile_v1_avatar">
            {getStringInitials(messagingNode?._clients_client_name_reciver_names)}
          </div>
          
          <div>
            
            <div className="elforge_message_profile_v1_name">
              <h4>{messagingNode?.primkey ? (  <span>{`Message / ${messagingNode?._clients_client_name_reciver_names}`}</span> ) :(<span> New Message</span>)}</h4>
            </div>
            
            <div className="elforge_message_profile_v1_meta">
              {messagingNode?.receiver_email}
            </div>
            
          </div>
          
        </div>
        
        
        
        {/* CONTENT */}
        
        <div className="elforge_message_profile_v1_body">
          
          
          {/* LEFT PANEL */}
          
          <div className="elforge_message_profile_v1_main_panel">
            
            <div className="elforge_message_profile_v1_message p-0 m-0 ">
              
              
              
              
              <div className="col-md-12 row justify-content-center m-0  p-0">
                {/*    Input cells section isle      */}
                <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                  <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                    <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                      <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                      <div className="col-md-5 text-center">Receiver Details</div>
                      <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                    </h5>
                    
                    <div className="col-md-12 pt-3 p-0" id=""></div>
                    
                    <div className="row justify-content-start col-md-12 p-0 m-0 ">
                      <LiveSearchDropdown
                      apiEndpoint={apiRoutes.phonebook.base}
                      tblName="clients"
                      parentTable="messaging"
                      inputName="_clients_client_name_reciver_names"
                      hiddenInputName="reciver_names"
                      valueField="client_id"
                      displayField="client_name"
                      label="Reciver Names"
                      defaultValue={{ client_id: messagingNode?.reciver_names || "", client_name: messagingNode?._clients_client_name_reciver_names || "" }}
                      onSelect={(id) => console.log("Just the ID:", id)}
                      onSelectFull={(dataRes) => loadClient(dataRes,handleInputChange)}
                      onInputChange={handleInputChange}
                      defaultColSize="col-md-6 hive_data_cell "
                      context={{hostParent : hostParent}}
                      />
                      
                      <MosySmartField
                      module="messaging"
                      field="receiver_email"
                      label="Receiver Email"
                      value={messagingNode?.receiver_email || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="messaging"
                      field="receiver_tel"
                      label="Receiver Tel"
                      value={messagingNode?.receiver_tel || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="messaging"
                      field="receiver_contacts"
                      label="Receiver Contacts"
                      value={messagingNode?.receiver_contacts || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                    </div>
                    
                  </div>
                  
                  <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                    <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                      <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                      <div className="col-md-5 text-center">Message Content</div>
                      <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                    </h5>
                    
                    <div className="col-md-12 pt-3 p-0" id=""></div>
                    
                    <div className="row justify-content-start col-md-12 p-0 m-0 ">
                      
                      <MosySmartField
                      module="messaging"
                      field="subject"
                      label="Subject"
                      value={messagingNode?.subject || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-12"}}
                      />
                      
                      
                      <MosySmartField
                      module="messaging"
                      field="message_details"
                      label="Message Details"
                      value={messagingNode?.message_details || ""}
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
                      <div className="col-md-5 text-center">Status</div>
                      <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                    </h5>
                    
                    <div className="col-md-12 pt-3 p-0" id=""></div>
                    
                    <div className="row justify-content-start col-md-12 p-0 m-0 ">
                      
                      {messagingNode?.primkey && (
                        <div className="form-group col-md-6 hive_data_cell  ">
                          <label >Sent State</label>
                          <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_sent_state" name="div_sent_state" placeholder="Sent State">{messagingNode?.sent_state || ""}</div>
                        </div>)}
                        
                        <MosySmartField
                        module="messaging"
                        field="message_date"
                        label="Date Sent"
                        value={messagingNode?.message_date || ""}
                        onChange={handleInputChange}
                        context={{ hostParent: hostParent  }}
                        inputOverrides={{}}
                        type="date"
                        cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                        />
                        
                      </div>
                      
                      <div className="col-md-12 text-center">
                        <SubmitButtons
                        src="MessageoutboxMainProfilePage"
                        tblName="messaging"
                        extraClass="optional-custom-class"
                        
                        />
                      </div>
                    </div></div>
                    {/*    Input cells section isle      */}
                  </div>
                  
                  <section className="hive_control">
                    <input type="hidden" id="messaging_dataNode" name="messaging_dataNode" value={paramMessageoutboxUptoken}/>
                    <input type="hidden" id="messaging_mosy_action" name="messaging_mosy_action" value={messageoutboxActionStatus}/>
                  </section>
                  
                  
                  
                </div>
                
              </div>
              
              
              
              {/* RIGHT SIDEBAR */}
              
              <div className="elforge_message_profile_v1_sidebar">
                
                <div className="elforge_message_profile_v1_info_card">
                  <div className="elforge_message_profile_v1_info_title">Receiver</div>
                  <div className="elforge_message_profile_v1_info_value">{messagingNode?._clients_client_name_reciver_names}</div>
                </div>
                
                <div className="elforge_message_profile_v1_info_card">
                  <div className="elforge_message_profile_v1_info_title">Receiver email</div>
                  <div className="elforge_message_profile_v1_info_value">{messagingNode?.receiver_email}</div>
                </div>
                
                <div className="elforge_message_profile_v1_info_card">
                  <div className="elforge_message_profile_v1_info_title">Subject</div>
                  <div className="elforge_message_profile_v1_info_value">{messagingNode?.subject}</div>
                </div>
                
                <div className="elforge_message_profile_v1_info_card">
                  <div className="elforge_message_profile_v1_info_title">Message type</div>
                  <div className="elforge_message_profile_v1_info_value">{messagingNode?.message_type}</div>
                </div>
                
              </div>
              
              
            </div>
          </form>
          
          
          <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
            {/*<hive_mini_list/>*/}
            
            
            
            <style jsx global>{`
            .data_list_section {
              display: none;
            }
            .bottom_tbl_handler{
              padding-bottom:70px!important;
            }
            `}
          </style>
          {messagingNode?.primkey && (
            <section className="col-md-12 m-0  pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Messages`} </h5>
              
              <div className="col-md-12 p-2 text-right ">
                <a href={`./list?messaging_mosyfilter`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
              </div>
              
              <MessageoutboxList
              key={`${customQueryStr}-${localEventSignature}`}
              dataIn={{
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                showDataControlSections:false,
                customQueryStr : '',
                customProfilePath:"./profile"
                
              }}
              
              dataOut={{
                setChildDataOut: InteprateMessageoutboxEvent,
                setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
              }}
              />
            </section>
          )}
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

