'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';


//print utils
import { exportTableToExcel } from '../../../MosyUtils/exportToExcel';
import { mosyPrintToPdf } from '../../../MosyUtils/hiveUtils';


//access control
import {MosyAccessControl} from "../../UiControl/MosyAccessControl"
import {MosyUIGuard } from "../../UiControl/MosyUiGuard"



//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam, mosyFormatDateOnly , mosyFormatDateTime, mosyTonum , mosyToggleSelectAllTblRows , mosySelectTblRows } from '../../../MosyUtils/hiveUtils';
import { mosyFilterUrl } from '../../DataControl/MosyFilterEngine';

//list components
import {
  MosySmartDropdownActions,
  AddNewButton,
  MosyActionButton,
  MosyGridRowOptions,
  MosyPaginationUi,
  DeleteButton,
  MosyImageViewer
} from '../../UiControl/componentControl';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadMessageoutboxListData, popDeleteDialog, InteprateMessageoutboxEvent  } from '../dataControl/MessageoutboxRequestHandler';

//state management
import { useMessageoutboxState } from '../dataControl/MessageoutboxStateManager';

import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

//custom fuctions
//import {  } from '../../AppCore/coreUtils';

// Use default base root (/)
const apiRoutes = getApiRoutes();
// ════════════════════════════════════════════════════════════════
// LIST PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════


//export list


///component access control key
export const MOSY_ACCESS_KEY = "VIEW_MESSAGING";

export default function MessageoutboxList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="./profile",
    showDataControlSections = true,
    parentUseEffectKey = "",
    parentStateSetters=null,
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Messageoutbox states
  const [stateItem, stateItemSetters] = useMessageoutboxState(settersOverrides);
  
  const localEventSignature = stateItem.localEventSignature
  const snackMessage = stateItem.snackMessage
  const snackOnDone = stateItem.snackOnDone
  
  //use route navigation system if need be
  const router = useRouter();
  
  useEffect(() => {
    
    const snackUrlAlert = mosyUrlParam("snack_alert")
    if(snackUrlAlert)
    {
      stateItemSetters.setSnackMessage(snackUrlAlert)
    }
    
    loadMessageoutboxListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className={`col-md-12 p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"messaging", keyword:stateItem.messageoutboxQuerySearchStr})}} encType="multipart/form-data">
      
      <div className="col-md-12 p-0 m-0 ">
        
        {/* HEADER */}
        
        {showDataControlSections && (
          <>
          <div className="  mb-4 col-md-12 p-0 m-0 ">
            
            <div className="align-items-center col-md-12 p-0 m-0 ">
              
              <div className="row  align-items-center col-md-12 m-3 p-3 ">
                
                <div className="col-md-4 py-2 ">
                  <b >Message Outbox</b>
                </div>
                
                <div className="col-md-5">
                  
                  <div className="col-md-12 row m-0 p-0 justify-content-start">
                    
                    <div className="col-md-8 text-left mx-0 px-0">
                      
                      <div className="col-md-12 p-0 text-right hive_list_search_tray">
                        <input type="text"  className="custom-search-input form-control"
                        placeholder="Search in Message Outbox " id="txt_messaging" name="txt_messaging"
                        onChange={(e) => stateItemSetters.setMessageoutboxQuerySearchStr(e.target.value)}
                        />
                        <button className="custom-search-botton" id="qmessaging_btn" name="qmessaging_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
                      </div>
                    </div>
                    
                    <div className="col-md-4 text-left mx-0 px-0">
                      <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
                    </div>
                    
                  </div>
                  
                </div>
                
                <div className="col-md-3 text-right">
                  
                  
                  <AddNewButton src="MessageoutboxList" link={customProfilePath} label="New Message" icon="envelope" />
                </div>
                
              </div>
              
            </div>
            
          </div>
        </>
      )}
      
      
      
      {/* TASK LIST */}
      
      <div className="row justify-content-center m-0 p-0 col-md-12">
        
        <div className="col-md-8 my-3">
          
          
          {stateItem.messageoutboxLoading ? (
            
            <div className="col-md-12 m-3 ">
              <div className="p-5 rounded-4  text-center text-muted mb-4">
                <h5 className="mb-0">
                  <i className="fa fa-spinner fa-spin mr-2"></i>
                  Loading Message Outbox ...
                </h5>
              </div>
            </div>
            
          ) : stateItem.messageoutboxListData?.length > 0 ? (
            
            stateItem.messageoutboxListData.map((listmessaging_result, index) => {
              
              return(
                
                
                <div key={index} className="lux_task_card mb-3 col-md-12 datarow_card">
                  
                  <div className="row justify-content-center col-md-12 p-0 m-0  ">
                    
                    <div className="col-md-12 text-left">
                      
                      <div className="lux_task_title">
                        {listmessaging_result.subject}
                        
                        <span className="lux_tag">
                          {listmessaging_result.receiver_contacts}
                        </span>
                        <span className="mx-2">.</span>
                        <span className="lux_task_time">
                          {listmessaging_result.message_date}
                        </span>
                      </div>
                      
                      <div className="lux_task_desc">
                        {listmessaging_result.message_details}
                      </div>
                      <div className="text-muted small">
                        <div className="table_cell_dropdown">
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="messaging"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listmessaging_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                          </div>
                        </div>
                      </div>
                      
                    </div>
                    
                    
                  </div>
                  <div className="col-md-12 border-top border_set text-right  p-0 m-0 ">
                    
                    <div className="col-md-12 p-0 m-0 ">
                      <em>{listmessaging_result.sent_state}</em>
                    </div>
                    
                  </div>
                </div>
                
                
              );
            })
          ) : (
            
            <>
            
            <div className="col-md-12 mt-4">
              <div className=" rounded-4 p-5 text-center text-muted col-md-12 ">
                <h6 className="mb-3 col-md-12 ">
                  <i className="fa fa-search mr-2 "></i> Sorry, no messages records found
                </h6>
                
                
                <AddNewButton src="MessageoutboxList"  link={customProfilePath} label="New Message" icon="envelope" />
                
              </div>
            </div>
            
            
          </>
          
        )}
        
        
        
      </div>
      
    </div>
    
    
    {/* PAGINATION */}
    
    <div className="row m-0 p-0 col-md-12">
      
      <div className="col-md-12 mt-3">
        
        <MosyPaginationUi
        src="MessageoutboxList"
        tblName="messaging"
        totalPages={stateItem.messageoutboxListPageCount}
        stateItemSetters={stateItemSetters}
        />
      </div>
      
    </div>
    
    
  </div>
</form>

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
</div>
);


}

