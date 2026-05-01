import { Suspense } from 'react';

import NudgefilesList from '../uiControl/NudgefilesList';

import { InteprateNudgefilesEvent } from '../dataControl/NudgefilesRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Nudge Files "//searchParams?.mosyTitle || "Nudge Files";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Nudge Files`,
    description: 'spotlight Nudge Files',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function NudgefilesMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <NudgefilesList  
                    
                     dataIn={{ parentUseEffectKey: "loadNudgefilesList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateNudgefilesEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }