"use client";
import React from "react";

export function MyTasksCard() {

return (

<div className="elforge_message_profile_v1_workspace container-fluid">

{/* PROFILE HEADER */}

<div className="elforge_message_profile_v1_header">

<div className="elforge_message_profile_v1_avatar">
Ka
</div>

<div>

<div className="elforge_message_profile_v1_name">
{'data1'}
</div>

<div className="elforge_message_profile_v1_meta">
{'data2'}
</div>

</div>

</div>



{/* CONTENT */}

<div className="elforge_message_profile_v1_body">


{/* LEFT PANEL */}

<div className="elforge_message_profile_v1_main_panel">

<div className="elforge_message_profile_v1_subject">
{'data3'}
</div>

<div className="elforge_message_profile_v1_recipient">
{'data4'}
</div>

<div className="elforge_message_profile_v1_message">

{'inputssection'}

</div>

</div>



{/* RIGHT SIDEBAR */}

<div className="elforge_message_profile_v1_sidebar">

<div className="elforge_message_profile_v1_info_card">
<div className="elforge_message_profile_v1_info_title">{'label:data1'}</div>
<div className="elforge_message_profile_v1_info_value">{'data1'}</div>
</div>

<div className="elforge_message_profile_v1_info_card">
<div className="elforge_message_profile_v1_info_title">{'label:data2'}</div>
<div className="elforge_message_profile_v1_info_value">{'data2'}</div>
</div>

<div className="elforge_message_profile_v1_info_card">
<div className="elforge_message_profile_v1_info_title">{'label:data3'}</div>
<div className="elforge_message_profile_v1_info_value">{'data3'}</div>
</div>

<div className="elforge_message_profile_v1_info_card">
<div className="elforge_message_profile_v1_info_title">{'label:data4'}</div>
<div className="elforge_message_profile_v1_info_value">{'data4'}</div>
</div>

</div>


</div>

{'minilistisle'}
</div>

);

}