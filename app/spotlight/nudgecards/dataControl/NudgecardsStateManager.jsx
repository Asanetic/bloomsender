
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultNudgecardsStateDefaults = {

  //state management for list page
  nudgecardsListData : [],
  nudgecardsListPageCount : 1,
  nudgecardsLoading: true,  
  parentUseEffectKey : 'loadNudgecardsList',
  localEventSignature: 'loadNudgecardsList',
  nudgecardsQuerySearchStr: '',

  
  //for profile page
  nudge_cardsNode : {},
  nudgecardsActionStatus : 'add_nudge_cards',
  paramnudgecardsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  nudgecardsUptoken:'',
  nudgecardsNode : {},
  activeScrollId : 'NudgecardsProfileTray',
  
  //dataScript
  nudgecardsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useNudgecardsState(overrides = {}) {
  const combinedDefaults = { ...defaultNudgecardsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

