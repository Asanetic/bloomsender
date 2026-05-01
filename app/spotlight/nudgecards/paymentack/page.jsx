import { Suspense } from 'react';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';
import PaymentAckCard from '../ackCardTemp';

export async function generateMetadata() {
  const mosyTitle = "Payment ack Card";

  return {
    title: mosyTitle,
    description: 'Visual client communication cards (payments, nudges, summaries)',

    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    

export default function AckCardMainPage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0">
               
               {/* PAGE HEADER */}
               <div className="p-3 border-bottom">
                 <h4 className="mb-0">Nudge Cards</h4>
                 <small className="text-muted">
                   Generate premium visual communication cards
                 </small>
               </div>

               <Suspense fallback={
                 <div className="col-md-12 p-5 text-center h3">
                   Generating cards...
                 </div>
               }>

                 <PaymentAckCard  />

               </Suspense>

             </div>
           </div>
         </div>
       </>
   );
}