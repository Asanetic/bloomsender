import { Suspense } from 'react';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';
import CustomContentCard from '../customCardTemp';
import { InteprateNudgefilesEvent } from '../../nudgefiles/dataControl/customCardData';

export async function generateMetadata() {
  const mosyTitle = "Custom nudge Card";

  return {
    title: mosyTitle,
    description: 'Visual client communication cards (payments, nudges, summaries)',

    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    

export default function CustomCardMainPage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0">
               
               {/* PAGE HEADER */}
               <div className="p-3 ">
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

                 <CustomContentCard
                                     dataIn={{ parentUseEffectKey: "initNudgefilesProfile" }} 
                                                            
                                     dataOut={{
                                        setChildDataOut: InteprateNudgefilesEvent//InteprateNudgefilesEvent
                                     }}  
                                     
                                     />

               </Suspense>

             </div>
           </div>
         </div>
       </>
   );
}