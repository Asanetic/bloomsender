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
import { loadNudgecardtemplatesListData, popDeleteDialog, InteprateNudgecardtemplatesEvent  } from '../dataControl/NudgecardtemplatesRequestHandler';

//state management
import { useNudgecardtemplatesState } from '../dataControl/NudgecardtemplatesStateManager';

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
export const MOSY_ACCESS_KEY = "VIEW_NUDGE_CARD_TEMPLATES";

//live data list component

export default function NudgecardtemplatesList({ dataIn = {}, dataOut = {} }) {
  
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
  
  //manage Nudgecardtemplates states
  const [stateItem, stateItemSetters] = useNudgecardtemplatesState(settersOverrides);
  
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
    
    loadNudgecardtemplatesListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className={`col-md-12  p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"nudge_card_templates", keyword:stateItem.nudgecardtemplatesQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Nudge Card Templates </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_nudge_card_templates" name="txt_nudge_card_templates" className="custom-search-input form-control" placeholder="Search in Nudge Card Templates "
          onChange={(e) => stateItemSetters.setNudgecardtemplatesQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qnudge_card_templates_btn" name="qnudge_card_templates_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="NudgecardtemplatesList" link={customProfilePath} label="New Template" icon="layout" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        <div className="ml-2 cpointer badge p-2 rounded badge-danger mb-3 text-white d-none mosy_msdn" id="mosy_sel_rows_isle" onClick={()=>{loadTemplates()}}>
        <i className="fa fa-info-circle mr-2"></i> With (<span id="mosy_sel_rows_count"></span>) selected items | Click for actions
        <input type="hidden" id="mosy_selected_rows" name="mosy_selected_rows" value=""/>
      </div>
      
      
      <div className="text-left m-0 p-0 col-md-12">
        <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
        onClick={() => {mosyPrintToPdf({elemId : "nudge_card_templates_print_card", defaultTitle:"Nudge Card Templates"})}}
        >
        <i className="fa fa-print "></i> Print List
      </div>
      <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
      
      onClick={() => exportTableToExcel("nudge_card_templates_data_table", "Nudge Card Templates.xlsx")}
      >
      <i className="fa fa-arrow-right "></i> Export to excel
    </div>
  </div>
  <div className="col-md-12 m-0 p-0" id="nudge_card_templates_print_card">
    <table className="table table-hover  text-left printTarget" id="nudge_card_templates_data_table">
      <thead className="text-uppercase">
        <tr>
          <th scope="col">
            
            <input type="checkbox" className="mosy_msdn mr-3 cpointer" id="selectAllCheckboxId" onClick={()=>{mosyToggleSelectAllTblRows();mosySelectTblRows()}}/>
            #</th>
            
            <th scope="col"><b>Template Name</b></th>
            <th scope="col"><b>Template Type</b></th>
            <th scope="col"><b>Status</b></th>
            <th scope="col"><b>Created Date</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.nudgecardtemplatesLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="5" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Nudge Card Templates ...</h5>
              </td>
            </tr>
          ) : stateItem.nudgecardtemplatesListData?.length > 0 ? (
            stateItem.nudgecardtemplatesListData.map((listnudge_card_templates_result, index) => {
              
              
              
              return(
                <Fragment key={`_row_${listnudge_card_templates_result.primkey}`}>
                  <tr key={listnudge_card_templates_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn">
                          
                          <input type="checkbox" className="select-row mosy_msdn mr-3 cpointer" onClick={()=>{mosySelectTblRows()}} value={listnudge_card_templates_result.primkey}/>
                          <b>{listnudge_card_templates_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="nudge_card_templates"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listnudge_card_templates_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                          </div>
                        </div>
                      </td>
                      
                      <td scope="col"><span title={listnudge_card_templates_result.template_name}>{magicTrimText(listnudge_card_templates_result.template_name, 70)}</span></td>
                      <td scope="col"><span title={listnudge_card_templates_result.template_type}>{magicTrimText(listnudge_card_templates_result.template_type, 70)}</span></td>
                      <td scope="col"><span title={listnudge_card_templates_result.status}>{magicTrimText(listnudge_card_templates_result.status, 70)}</span></td>
                      <td scope="col"><span title={listnudge_card_templates_result.created_at}>{mosyFormatDateTime(listnudge_card_templates_result.created_at)}</span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="5" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no nudge card templates records found</h6>
                    
                    <AddNewButton src="NudgecardtemplatesList"  link={customProfilePath} label="New Template" icon="layout" />
                    <div className="col-md-12 pt-5 " id=""></div>
                  </div>
                </td></tr>
                
              )}
              
              <tr className="bg-light">
                <th></th>
                
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                
              </tr>
            </tbody>
            
          </table>
        </div>
        <MosyPaginationUi
        src="NudgecardtemplatesList"
        tblName="nudge_card_templates"
        totalPages={stateItem.nudgecardtemplatesListPageCount}
        stateItemSetters={stateItemSetters}
        />
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

