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
import { loadPhonebookListData, popDeleteDialog, IntepratePhonebookEvent  } from '../dataControl/PhonebookRequestHandler';

//state management
import { usePhonebookState } from '../dataControl/PhonebookStateManager';

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
export const MOSY_ACCESS_KEY = "VIEW_CLIENTS";

export default function PhonebookList({ dataIn = {}, dataOut = {} }) {
  
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
  
  //manage Phonebook states
  const [stateItem, stateItemSetters] = usePhonebookState(settersOverrides);
  
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
    
    loadPhonebookListData(customQueryStr, stateItemSetters);
    
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
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"clients", keyword:stateItem.phonebookQuerySearchStr})}} encType="multipart/form-data">
      
      <div className="container-fluid p-4 bg-white">
        
        {/* HEADER */}
        <div className="row justify-content-center align-items-center mb-4">
          {showDataControlSections && (
            <>
            <h5 className="fw-semibold mb-0 col-md-6">Phonebook</h5>
            <div className="col-md-6 text-right">
              
              
              <AddNewButton src="PhonebookList" link={customProfilePath} label="New Client" icon="user-plus" />
            </div>
          </>
        )}
      </div>
      
      {/* GRID */}
      <div className="row justify-content-center m-0 p-0 col-md-12">
        
        {showDataControlSections && (
          <>
          <div className="col-md-12 row mx-0 px-0 justify-content-start border-bottom py-2 border_set mb-4">
            <div className="col-md-4 text-left mx-0 px-0">
              <div className="col-md-12 p-0 text-right hive_list_search_tray">
                <input type="text"  className="custom-search-input form-control"
                placeholder="Search in Phonebook " id="txt_clients" name="txt_clients"
                onChange={(e) => stateItemSetters.setPhonebookQuerySearchStr(e.target.value)}
                />
                <button className="custom-search-botton" id="qclients_btn" name="qclients_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
              </div></div>
              <div className="col-md-2 text-left mx-0 px-0"><a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a> </div>
            </div>
          </>
        )}
        
        
        {stateItem.phonebookLoading ? (
          
          <div className="col-md-12 m-3 ">
            <div className="p-5 rounded-4  text-center text-muted mb-4">
              <h5 className="mb-0">
                <i className="fa fa-spinner fa-spin mr-2"></i>
                Loading Phonebook ...
              </h5>
            </div>
          </div>
          
        ) : stateItem.phonebookListData?.length > 0 ? (
          
          stateItem.phonebookListData.map((listclients_result, index) => {
            
            return(
              
              
              <div key={index} className="col-md-3 mb-3 datarow_card">
                
                <div className="d-flex align-items-center p-3 border elforge_mini_card_list_card">
                  
                  {/* Avatar */}
                  <MosyImageViewer
                  media={`/api/mediaroom?media=${btoa((listclients_result.client_photo))}`}
                  mediaRoot={""}
                  defaultLogo={logo.src}
                  imageClass="elforge_mini_card_list_avatar"
                  />
                  
                  <div className="text-muted small">
                    <div className="table_cell_dropdown">
                      <div className="table_cell_dropdown-content">
                        <MosySmartDropdownActions
                        tblName="clients"
                        setters={{
                          
                          childStateSetters: stateItemSetters,
                          parentStateSetters: parentStateSetters
                          
                        }}
                        
                        attributes={`${listclients_result.primkey}:${customProfilePath}:false`}
                        callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                        
                        />
                        
                      </div>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="mx-3">
                    
                    <div className="fw-semibold elforge_mini_card_list_name">
                      {listclients_result.client_tel}
                    </div>
                    
                    <div className="text-muted small">
                      {listclients_result.client_name}
                    </div>
                    
                    <div className="text-muted small d-none">
                      <span className="badge text-info">{listclients_result.status}</span>
                    </div>
                    
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
                <i className="fa fa-search mr-2 "></i> Sorry, no clients records found
              </h6>
              
              
              <AddNewButton src="PhonebookList"  link={customProfilePath} label="New Client" icon="user-plus" />
              
            </div>
          </div>
          
          
        </>
        
      )}
      
      
      
      <div className="col-md-12 mt-3">
        
        <MosyPaginationUi
        src="PhonebookList"
        tblName="clients"
        totalPages={stateItem.phonebookListPageCount}
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

