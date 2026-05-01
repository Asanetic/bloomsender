
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultNudgecardtemplatesStateDefaults = {

  //state management for list page
  nudgecardtemplatesListData : [],
  nudgecardtemplatesListPageCount : 1,
  nudgecardtemplatesLoading: true,  
  parentUseEffectKey : 'loadNudgecardtemplatesList',
  localEventSignature: 'loadNudgecardtemplatesList',
  nudgecardtemplatesQuerySearchStr: '',

  
  //for profile page
  nudge_card_templatesNode : {},
  nudgecardtemplatesActionStatus : 'add_nudge_card_templates',
  paramnudgecardtemplatesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  nudgecardtemplatesUptoken:'',
  nudgecardtemplatesNode : {},
  activeScrollId : 'NudgecardtemplatesProfileTray',
  
  //dataScript
  nudgecardtemplatesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useNudgecardtemplatesState(overrides = {}) {
  const combinedDefaults = { ...defaultNudgecardtemplatesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

