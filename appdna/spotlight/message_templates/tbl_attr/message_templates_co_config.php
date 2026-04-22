<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

////1. message_templates

//"primkey" , "record_id" , "template_name" , "message_subject" , "message_template" , "template_code" , "hive_site_id" , "hive_site_name" , <br><br>


//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, template_name, message_subject, template_code    
//important columns on profile : record_id, template_name, message_subject, message_template, template_code    

/*================= How the module related to the whole app / app flow ==================== 

This module manages reusable message templates used across the system for SMS, email, and notifications.
It allows dynamic message generation using predefined templates.

Key relationships:
- Used by messaging module when sending messages
- Supports dynamic placeholders via template_code
- Centralized control of communication formats

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of app_users please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  

  // =========================
  // Core definitions
  // =========================
  $primary_table__="message_templates";
  $__page_title ="Message Templates";

  $core_module_configs_=[

    "primary_table"=>$primary_table__,
    "table_alias" =>"messagetemplates",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"messagetemplates",
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
  //$list_template= file_get_contents('../novatemplates/dna_grid3.tdna');
  
  //custom profile ui template path
  //$profile_template= file_get_contents('../novatemplates/bgprofile.tdna');
  //$profile_template= file_get_contents('../novatemplates/profile8.tdna');

  $csgrid_dictionary = [

      "data1" => "template_name",      
      "data2" => "message_subject",          
      "data3" => "template_code",     
      "data4" => "record_id"                

  ];

  $profile_dictionary = [

      "data1" => "template_name",               
      "data2" => "message_subject",         
      "data3" => "template_code",         
      "data4" => "message_template"         

  ];


  $input_prefix="";

  $novanest_module_ui_blueprint_ = [

    "db_schema" => [

        "custom_tbl_cols" => [
           //"message_templates" => ["usage_count"]
        ],

        "custom_profile_default_data" => [
            //"template_name" => "New Template"
        ],

        "dataRowMutations"=>[

         /* "usage_count" => [
              "type" => "count",
              "table" => "messaging",
              "link"  => "template_code:template_code"
          ]*/ 
                 
          
        ],

      
    ],

    "page_layout" => [

        "desired_column_order" => [
            "message_templates" => ["primkey","record_id","template_name","message_subject","template_code"]
        ],

        "form_input_segmentation_arr" => [
            "message_templates" => [
                "Template Details" => ["template_name","template_code"],
                "Message Content" => ["message_subject","message_template"]
            ]
        ],

        "image_columns" => [],
        "default_col_class" => "col-md-6",
        "hidden_inputs" => [], 
        "print_tables" => ["message_templates"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","message_subject","template_code"],  
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => [], 
        "textarea_array" => ["message_template"], 
        "content_editable" => [], 

        "static_drop_down_array" => [],

        "dynamic_drop_down_array" => [], 
        "password_columns" => [], 
        "title_columns" => [], 
        "date_columns" => [],
        "datetime_columns" => [],

        "rename_cols_array" => [ 
            "template_name" => "Template Name",
            "message_subject" => "Subject:col-md-12",
            "message_template" => "Template Body"
        ],

        "rename_tables_array" => [
            "message_templates" => "Message Templates"
        ],

        "new_label_buttons_arr" => [ 
            "message_templates" => "file-text:New Template:{`Template / \${message_templatesNode?.template_name}`}" 
        ],

        "profile_pic_style" => ""
    ],
    
    "import"=>[
      "message_templates"=>["csv"=>"template_name,message_subject,message_template,template_code","record_id"=>""]
    ],

    "data_behaviour" => [
       "add_grid_check_boxes"=>[
          "message_templates_"=>"loadTemplates()"
        ],
                 
        "custom_multi_grid_rows" => [
          /*"used_in_messages"=>[
            "table"=>"messaging",
            "link"=>"messages_list",
            "query"=>"template_code='{{record_id}}'",
            "title"=>"Messages Using Template",
            "columns"=>["messageid","reciver_names","sent_state","message_date"]
          ]*/
        ], 
      
        "custom_profile_col_data" => [], 
      
        "custom_profile_default_data" => [],
        "connection_cols" => [ ]
    ]
  
  ];

  $list_btn_table_array=[
      $primary_table__=>[
         /*"copy: Duplicate Template" => [
             "fe" => "duplicateTemplate(listmessage_templates_result.record_id)",
             "file" => "template-actions"
         ]*/      
      ],  
  ];

  $profile_btn_table_array=[
      $primary_table__=>[
         /*"paper-plane: Test Template" => [
             "fe" => "testTemplate(message_templatesNode)",
             "file" => "template-actions"
         ]*/        
      ],
  ];

  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         /*"eye: Preview Template" => [
             "fe" => "previewTemplate(listmessage_templates_result.record_id)",
             "file" => "template-preview"
         ]*/        
      ]
  ];

  $interlink_lists=[
  /* "templateUsage"=>[ 
     "filter_str"=>" template_code='\${message_templatesNode?.template_code}' ",
     "module_name"=>"Messaging",
     "list_title"=>"Messages Using This Template",
     "custom"=>false,
     "external"=>true,
     "alias"=>'messaging'
   ]*/
  ];
   
  $interlink_profile=[
   /*"linkedMessage"=>[ 
     "filter_str"=>"template_code='{message_templatesNode?.template_code}'",
     "module_name"=>"Messaging",
     "profile_title"=>"Related Message",
     "custom"=>false,
     "external"=>true,
     "alias"=>'messaging'
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
  $image_upload_btn_class="";
  $mutations=$novanest_module_ui_blueprint_["db_schema"]["dataRowMutations"]

?>
