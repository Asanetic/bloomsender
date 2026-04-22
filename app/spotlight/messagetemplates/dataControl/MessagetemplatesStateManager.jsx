
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultMessagetemplatesStateDefaults = {

  //state management for list page
  messagetemplatesListData : [],
  messagetemplatesListPageCount : 1,
  messagetemplatesLoading: true,  
  parentUseEffectKey : 'loadMessagetemplatesList',
  localEventSignature: 'loadMessagetemplatesList',
  messagetemplatesQuerySearchStr: '',

  
  //for profile page
  message_templatesNode : {},
  messagetemplatesActionStatus : 'add_message_templates',
  parammessagetemplatesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  messagetemplatesUptoken:'',
  messagetemplatesNode : {},
  activeScrollId : 'MessagetemplatesProfileTray',
  
  //dataScript
  messagetemplatesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useMessagetemplatesState(overrides = {}) {
  const combinedDefaults = { ...defaultMessagetemplatesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

