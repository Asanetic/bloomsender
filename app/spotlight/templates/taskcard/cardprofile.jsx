"use client";
import React from "react";

export function ElforgeProfileHeader() {

const fileId = "elforge_profile_file";
const fileLabelId = "elforge_profile_file_label";

return (

<div className="elforge_message_profile_v1_header_bar row m-0 col-md-12">

<style jsx>{`

.elforge_message_profile_v1_header_bar{
display:flex;
align-items:center;
gap:16px;
padding:14px 18px;
background:#ffffff;
border-bottom:1px solid #e8ecf2;
flex-wrap:wrap;
}


/* AVATAR */

.elforge_message_profile_v1_avatar{
width:52px;
height:52px;
border-radius:50%;
object-fit:cover;
background:#35a8d8;
display:flex;
align-items:center;
justify-content:center;
color:white;
font-weight:600;
font-size:18px;
}


/* TEXT */

.elforge_message_profile_v1_header_text{
display:flex;
flex-direction:column;
}

.elforge_message_profile_v1_title{
font-size:18px;
font-weight:600;
color:#1f2937;
}

.elforge_message_profile_v1_subtitle{
font-size:13px;
color:#6b7280;
margin-top:2px;
}


/* FILE BUTTON */

.elforge_message_profile_v1_upload_btn{
border-radius:6px;
padding:6px 14px;
font-size:13px;
cursor:pointer;
transition:.2s;
}

.elforge_message_profile_v1_upload_btn:hover{
background:#f6f8fb;
}


/* FILE NAME */

.elforge_message_profile_v1_file_badge{
font-size:12px;
background:#eef2f7;
padding:4px 8px;
border-radius:6px;
margin-right:10px;
color:#444;
}


/* RESPONSIVE */

@media (max-width:600px){

.elforge_message_profile_v1_header_bar{
flex-direction:column;
align-items:flex-start;
}

}

`}</style>


{/* AVATAR */}

<div className="col-auto p-0">
<img
src="/img/sampleimg1.jpg"
className="elforge_message_profile_v1_avatar"
/>
</div>


{/* TEXT */}

<div className="col-md p-0">

<div className="elforge_message_profile_v1_header_text">

<div className="elforge_message_profile_v1_title">
Tatu city / Email test from Nova bloom
</div>

<div className="elforge_message_profile_v1_subtitle">
0710766390
</div>

</div>

</div>


{/* FILE UPLOAD */}

<div className="col-md-auto pt-2 p-0">

<em
id={fileLabelId}
className="elforge_message_profile_v1_file_badge"
></em>

<label className="text-primary border elforge_message_profile_v1_upload_btn cpointer bg-white">

<i className="fa fa-upload mr-2"></i> Choose File

<input
type="file"
id={fileId}
name={fileId}
style={{display:"none"}}
onChange={(e)=>{
const val = e.target.value.replace("C:\\fakepath\\","");
document.getElementById(fileLabelId).innerText = val;
}}
/>

</label>

</div>


</div>

);

}