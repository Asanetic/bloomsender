
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultPhonebookStateDefaults = {

  //state management for list page
  phonebookListData : [],
  phonebookListPageCount : 1,
  phonebookLoading: true,  
  parentUseEffectKey : 'loadPhonebookList',
  localEventSignature: 'loadPhonebookList',
  phonebookQuerySearchStr: '',

  
  //for profile page
  clientsNode : {},
  phonebookActionStatus : 'add_clients',
  paramphonebookUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  phonebookUptoken:'',
  phonebookNode : {},
  activeScrollId : 'PhonebookProfileTray',
  
  //dataScript
  phonebookCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function usePhonebookState(overrides = {}) {
  const combinedDefaults = { ...defaultPhonebookStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

