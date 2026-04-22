<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

////1. messaging

//"primkey" , "messageid" , "receiver_contacts" , "receiver_tel" , "receiver_email" , "reciver_names" , "message_type" , "site_id" , "group_name" , "message_date" , "sent_state" , "msg_read_state" , "subject" , "message_label" , "message_details" , "sms_cost" , "page_count" , "hive_site_id" , "hive_site_name" , "custom_dictionary" , "message_signature" , "ref_number" , <br><br>


//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : messageid, reciver_names, receiver_email, receiver_tel, message_type, sent_state, message_date    
//important columns on profile : messageid, reciver_names, receiver_email, receiver_tel, message_type, subject, message_label, message_details, sent_state, msg_read_state, message_date    

/*================= How the module related to the whole app / app flow ==================== 

This module manages messaging across the system including SMS, email, and internal messages.
It handles sending, tracking delivery, message status, and storing message content.

Key relationships:
- Linked to users via receiver_contacts / receiver_email / receiver_tel
- Used by notifications, alerts, and communication services
- Tracks delivery state and read status

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of app_users please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  

  // =========================
  // Core definitions
  // =========================
  $primary_table__="messaging";
    $__page_title ="Message Outbox";

  $core_module_configs_=[

    "primary_table"=>$primary_table__,
    "table_alias" =>"messages",     
    "primary_key"=>"primkey",
    "record_id"=>"messageid",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"messaging",
    "multigrid_col_span"=>"9"      

  ];
  
  $modules_and_links_=[
 
    "profile_module_name"=>"profile", 
    "profile_module_link"=>"./profile",
    "addnew_page_link"=>"./profile",
    
    "list_module_name"=>"list", 
    "list_page_link"=>"./list",
    "write_profile"=>true,
    "write_list"=>true
    
  ];

  $profile_file_name   = $modules_and_links_["profile_module_name"];
  $list_file_name      = $modules_and_links_["list_module_name"];
  $back_to_list_       = $modules_and_links_["list_page_link"];
  $add_new_page_link   = $modules_and_links_["addnew_page_link"];


  //custom grid ui template code paths
  //$list_template= file_get_contents('../novatemplates/dna_user_card_list.tdna');
  $list_template= file_get_contents('../novatemplates/dna_message_list.tdna');
  
  //custom profile ui template path
  //$profile_template= file_get_contents('../novatemplates/bgprofile.tdna');
  $profile_template= file_get_contents('../novatemplates/dna_message_profile_ui.tdna');

  $csgrid_dictionary = [

      "data1" => "subject",      
      "data2" => "message_details",          
      "data3" => "receiver_contacts",     
      "data4" => "message_date",     
      "data5" => "sent_state"                

  ];

  $profile_dictionary = [

      "data1" => "_clients_client_name_reciver_names",               
      "data2" => "receiver_email",         
      "data3" => "subject",         
      "data5" => "message_details",    
      "data4" => "message_type",    
      "initials"=>"_clients_client_name_reciver_names:_"

  ];


  $input_prefix="";

  $novanest_module_ui_blueprint_ = [

    "db_schema" => [

        "custom_tbl_cols" => [
           //"messaging" => ["delivery_summary"]
        ],

        "custom_profile_default_data" => [
            //"sent_state" => "pending"
        ],

        "dataRowMutations"=>[

         /* "sms_cost_total" => [
              "type" => "sum",
              "table" => "messaging",
              "link"  => "messageid:messageid",
              "column" => "sms_cost"
          ]*/ 
                 
          
        ],

      
    ],

    "page_layout" => [

        "desired_column_order" => [
            "messaging" => ["primkey","messageid","reciver_names","receiver_email","receiver_tel","message_type","sent_state","message_date"]
        ],

        "form_input_segmentation_arr" => [
            "messaging" => [
                "Receiver Details" => ["reciver_names","receiver_email","receiver_tel","receiver_contacts"],
                "Message Content" => ["subject","message_details"],
                "Status" => ["sent_state","msg_read_state","message_date"]
            ]
        ],

        "image_columns" => [],
        "default_col_class" => "col-md-4",
        "hidden_inputs" => [], 
        "print_tables" => ["messaging"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name","custom_dictionary","message_type","message_signature","page_count","sms_cost","group_name","site_id","message_label","ref_number","msg_read_state"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","message_details","custom_dictionary","message_signature","page_count","sms_cost","group_name","site_id","receiver_contacts","ref_number","msg_read_state"],  
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => ["sms_cost"], 
        "textarea_array" => ["message_details"], 
        "content_editable" => [], 

        "static_drop_down_array" => [
        ],

        "dynamic_drop_down_array" => [], 
        "password_columns" => [], 
        "title_columns" => [], 
        "date_columns" => ["message_date"],
        "datetime_columns" => [],

        "rename_cols_array" => [ 
            "message_date" => "Date Sent",
            "subject" => "Subject:col-md-12",
            "_clients_client_name_reciver_names" => "Receiver",
            "message_date" => "Date Sent"
        ],

        "rename_tables_array" => [
            "messaging" => "Messages"
        ],

        "new_label_buttons_arr" => [ 
            "messaging" => "envelope:New Message:{`Message / \${messagingNode?._clients_client_name_reciver_names}`}" 
        ],

        "profile_pic_style" => ""
    ],
    
    "import"=>[
      "messaging"=>["csv"=>"reciver_names,receiver_email,receiver_tel,subject,message_details,message_type","record_id"=>""]
    ],

    "data_behaviour" => [
       "add_grid_check_boxes"=>[
          "messaging_"=>"loadMessages()"
        ],
                 
        "custom_multi_grid_rows" => [
          /*"message_logs"=>[
            "table"=>"messaging",
            "link"=>"message_logs",
            "query"=>"messageid='{{record_id}}'",
            "title"=>"Message Logs",
            "columns"=>["message_date","sent_state","sms_cost"]
          ]*/
        ], 
      
      //Table name : clients

// columns : "primkey" , "client_id" , "client_name" , "client_email" , "client_tel" , "client_location" , "client_photo" , "gender" , "date_registered" , "password" , "admin_id" , "hive_site_id" , "hive_site_name" , 


        "custom_profile_col_data" => ["sent_state"=>"?"], 
      
        "custom_profile_default_data" => [],
        "connection_cols" => [
         "reciver_names"=>"clients:client_id:client_name:apiRoutes.phonebook.base:loadClient(dataRes,handleInputChange)"
        ]
    ]
  
  ];

  $list_btn_table_array=[
      $primary_table__=>[
         /*"filter: Filter by Status" => [
             "fe" => "filterByStatus(`../messaging/apilist`,`Filter status`, `messaging`,`sent_state`)",
             "file" => "messaging-filters"
         ]*/      
      ],  
  ];

  $profile_btn_table_array=[
      $primary_table__=>[
         "paper-plane: Send Message" => [
             "fe" => "sendMessage(messagingNode?.messageid)",
             "be" => "sendMessage()",
             "file" => "messaging-actions"
         ],
        
        "file-text: Load templates" => [
             "fe" => "loadTemplates()",
             "be" => "sendMessage()",
             "file" => "messaging-actions"
         ],
        
         "whatsapp: Share via whatsapp" => [
             "fe" => "whatsappShare()",
             "file" => "messaging-actions"
         ]         
      ],
  ];

  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         /*"eye: View Message" => [
             "fe" => "viewMessage(listmessaging_result.messageid)",
             "file" => "messaging-details"
         ]*/        
      ]
  ];

  $interlink_lists=[
   "relatedUser"=>[ 
     "filter_str"=>" ",
     "module_name"=>"Messageoutbox",
     "list_title"=>"Messages",
     "custom"=>false,
     "external"=>false,
     "alias"=>'messages'
   ]
  ];
   
  $interlink_profile=[
   /*"linkedUser"=>[ 
     "filter_str"=>"email='{messagingNode?.receiver_email}'",
     "module_name"=>"Users",
     "profile_title"=>"User Profile",
     "custom"=>false,
     "external"=>true,
     "alias"=>'app_users'
   ]*/
  ];  

  $customProfileData="{}";

  $override_def_col_size="col-md-6 hive_data_cell ";
  $override_segmentation_section_class="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section";

  $additional_details_segment_title="";

  $col_size_def='col-md-12';

  $def_profile_container_class="col-md-12 rounded text-left p-2 mb-0  bg-white ";
  $def_profile_inner_container_class='` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`';  
  $override_justify_class="justify-content-start";
  $overide_img_section_class="col-md-6 mr-lg-5";
  $override_large_col_size="col-md-12 hive_data_cell";
  $image_style_="product_image";
  $mutations=$novanest_module_ui_blueprint_["db_schema"]["dataRowMutations"]

?>
