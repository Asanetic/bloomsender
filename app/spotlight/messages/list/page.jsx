import { Suspense } from 'react';

import MessageoutboxList from '../uiControl/MessageoutboxList';

import { InteprateMessageoutboxEvent } from '../dataControl/MessageoutboxRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Message Outbox "//searchParams?.mosyTitle || "Message Outbox";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Message Outbox`,
    description: 'spotlight Message Outbox',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function MessageoutboxMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <MessageoutboxList  
                    
                     dataIn={{ parentUseEffectKey: "loadMessageoutboxList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateMessageoutboxEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }