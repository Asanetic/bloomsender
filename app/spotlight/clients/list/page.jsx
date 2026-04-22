import { Suspense } from 'react';

import PhonebookList from '../uiControl/PhonebookList';

import { IntepratePhonebookEvent } from '../dataControl/PhonebookRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Phonebook "//searchParams?.mosyTitle || "Phonebook";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Phonebook`,
    description: 'spotlight Phonebook',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function PhonebookMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <PhonebookList  
                    
                     dataIn={{ parentUseEffectKey: "loadPhonebookList" }}
                       
                     dataOut={{
                       setChildDataOut: IntepratePhonebookEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }