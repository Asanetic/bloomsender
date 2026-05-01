
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultNudgefilesStateDefaults = {

  //state management for list page
  nudgefilesListData : [],
  nudgefilesListPageCount : 1,
  nudgefilesLoading: true,  
  parentUseEffectKey : 'loadNudgefilesList',
  localEventSignature: 'loadNudgefilesList',
  nudgefilesQuerySearchStr: '',

  
  //for profile page
  nudge_filesNode : {},
  nudgefilesActionStatus : 'add_nudge_files',
  paramnudgefilesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  nudgefilesUptoken:'',
  nudgefilesNode : {},
  activeScrollId : 'NudgefilesProfileTray',
  
  //dataScript
  nudgefilesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useNudgefilesState(overrides = {}) {
  const combinedDefaults = { ...defaultNudgefilesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

