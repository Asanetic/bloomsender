"use client";
import React from "react";

export function TasksDashboard() {

const tasks = [
{
title: "Using your Strategies, create a new plan",
tag: "Emotional",
desc: "Create a color-code system in your binder with your academic advisor. Have him/her check it regularly for two weeks and sign it off.",
time: "2 New Notes"
},
{
title: "Finish First Lesson",
tag: "Education",
desc: "Draw a picture of what it feels like to struggle with attention and/or hyperactivity issues. Share it with your therapist and two teachers.",
time: "2 New Notes"
},
{
title: "Make your Goal Check-in",
tag: "Emotional",
desc: "Goal Check-in is important to monitor emotional state. Make your daily check-in and answer all questions",
time: "2 New Notes"
},
{
title: "Make your Training",
tag: "Physical",
desc: "To start your training you need to download Lesson 1 from the library and complete test",
time: "2 New Notes"
}
];
const showDataControlSections = true;
return (

<div className="lux_tasks_dashboard container-fluid">
 
{/* HEADER */}

<div className="row justify-content-center m-0 p-0 col-md-12 mb-3">

<div className="col-md-12">
<div className="lux_header_title">{'pagetitle'}</div>
</div>
 

</div>


{/* SEARCH + FILTER */}

  {/* SEARCH BAR */}
  {showDataControlSections && (
  <>
    <div className="elforge_userlist_template_v1_searchBar mb-4 col-md-12">
      <div className="align-items-center col-md-12">
        <div className="row g-2 align-items-center col-md-12">

          <div className="col-md-4 pt-2">
             {'actionbuttons'}
          </div>

          <div className="col-md-5">
            {showDataControlSections && (
            <>
              <div className="col-md-12 row m-0 p-0 justify-content-start">
                <div className="col-md-8 text-left mx-0 px-0">
                  {'searchisle'}
                </div>
                <div className="col-md-4 text-left mx-0 px-0">
                  {'refreshisle'}
                </div>
              </div>
            </>
            )}
          </div>

          <div className="col-md-3 text-right">
            {'addnewbtn'}
          </div>

        </div>
      </div>
    </div>
  </>
  )}

 



{/* TASK LIST */}

<div className="row justify-content-center m-0 p-0 col-md-12">

<div className="col-md-7">

{tasks.map(function(task,index){

return (

<div key={index} className="lux_task_card mb-3">

<div className="row">

<div className="col-md-9">

<div className="lux_task_title">

{task.title}

<span className="lux_tag">
{task.tag}
</span>

</div>

<div className="lux_task_desc">
{task.desc}
</div>

</div>

<div className="col-md-3 text-end">

<div className="lux_task_time">
{task.time}
</div>

</div>

</div>

</div>

);

})}

</div>

</div>

</div>

);

}