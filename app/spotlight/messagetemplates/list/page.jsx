import { Suspense } from 'react';

import MessagetemplatesList from '../uiControl/MessagetemplatesList';

import { InteprateMessagetemplatesEvent } from '../dataControl/MessagetemplatesRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Message Templates "//searchParams?.mosyTitle || "Message Templates";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Message Templates`,
    description: 'spotlight Message Templates',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function MessagetemplatesMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <MessagetemplatesList  
                    
                     dataIn={{ parentUseEffectKey: "loadMessagetemplatesList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateMessagetemplatesEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }