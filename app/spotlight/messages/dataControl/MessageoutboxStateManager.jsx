
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultMessageoutboxStateDefaults = {

  //state management for list page
  messageoutboxListData : [],
  messageoutboxListPageCount : 1,
  messageoutboxLoading: true,  
  parentUseEffectKey : 'loadMessageoutboxList',
  localEventSignature: 'loadMessageoutboxList',
  messageoutboxQuerySearchStr: '',

  
  //for profile page
  messagingNode : {},
  messageoutboxActionStatus : 'add_messaging',
  parammessageoutboxUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  messageoutboxUptoken:'',
  messageoutboxNode : {},
  activeScrollId : 'MessageoutboxProfileTray',
  
  //dataScript
  messageoutboxCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useMessageoutboxState(overrides = {}) {
  const combinedDefaults = { ...defaultMessageoutboxStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

