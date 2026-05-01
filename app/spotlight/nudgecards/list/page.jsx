import { Suspense } from 'react';

import NudgecardsList from '../uiControl/NudgecardsList';

import { InteprateNudgecardsEvent } from '../dataControl/NudgecardsRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Nudge Cards "//searchParams?.mosyTitle || "Nudge Cards";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Nudge Cards`,
    description: 'spotlight Nudge Cards',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function NudgecardsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <NudgecardsList  
                    
                     dataIn={{ parentUseEffectKey: "loadNudgecardsList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateNudgecardsEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }