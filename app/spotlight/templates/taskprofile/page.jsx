import { Suspense } from 'react';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';
import { MyTasksCard } from './taskprofile';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "System Users "//searchParams?.mosyTitle || "System Users";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `System Users`,
    description: 'mosycomms System Users',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function taskcardMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               <MyTasksCard/>
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }