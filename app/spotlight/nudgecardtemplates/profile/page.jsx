import { Suspense } from 'react';

import NudgecardtemplatesProfile from '../uiControl/NudgecardtemplatesProfile';

import { InteprateNudgecardtemplatesEvent } from '../dataControl/NudgecardtemplatesRequestHandler';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Nudge Card Templates "//searchParams?.mosyTitle || "Nudge Card Templates";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Nudge Card Templates`,
    description: 'spotlight Nudge Card Templates',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    
                      

export default function NudgecardtemplatesMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <NudgecardtemplatesProfile 
                    dataIn={{ parentUseEffectKey: "initNudgecardtemplatesProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateNudgecardtemplatesEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}