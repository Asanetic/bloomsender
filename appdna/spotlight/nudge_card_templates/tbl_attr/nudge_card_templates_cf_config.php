<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

////1. nudge_card_templates

//"primkey" , "record_id" , "template_name" , "template_type" , "html_content" , "css_content" , "status" , "created_at" , "hive_site_id" , "hive_site_name" , <br><br>


//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, full_name, email, phone_number, account_status, country, created_at    
//important columns on profile : record_id, first_name, last_name, full_name, email, phone_number, account_status, email_verified, phone_verified, country, currency, created_at, updated_at    

/*================= How the module related to the whole app / app flow ==================== 

This module manages reusable nudge card templates. It handles template creation,
storage of HTML/CSS content, and classification of template types.

Key relationships:
- Used by nudge_cards via template_id
- Defines structure and styling for generated cards
- Controls template lifecycle through status

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of app_users please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .

  // =========================
  // Core definitions
  // =========================
  $primary_table__="nudge_card_templates";
  $__page_title ="Nudge Card Templates";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"nudgecardtemplates",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"nudgecardtemplates",
    "multigrid_col_span"=>"9"      

  ];
  
  $modules_and_links_=[
 
    //form data page eg users/profile leave as profile    
    "profile_module_name"=>"profile", 
    "profile_module_link"=>"./profile",
    "addnew_page_link"=>"./profile",
    
    //list / grid data page eg users/list leave as list
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

  /*
  The data Dictionary only applies if you selected a custom list ($csgrid_dictionary) or profile ($profile_dictionary) template 
  $for list we use $list_template for profile we use $profile_dictionary. Dont uncomment if you dont have the template
  if not selected the compiler defaults to the inbuild template
  |--------------------------------------------------------------------------
  | Example 1: Grid Dictionary
  |--------------------------------------------------------------------------
  | These can map to ANY table columns.
  */

  $csgrid_dictionary = [

      "data1" => "template_name",
      "data2" => "template_type",
      "data3" => "status",
      "data4" => "created_at"

  ];


  /*
  |--------------------------------------------------------------------------
  | Example 2: Profile Dictionary
  |--------------------------------------------------------------------------
  | Notice same data slots, different column mapping.
  */

  $profile_dictionary = [

      "data1" => "template_name",
      "data2" => "template_type",
      "data3" => "html_content",
      "data4" => "css_content"

  ];


  $input_prefix="";

  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           //"nudge_card_templates" => ["usage_count"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"status" => "active"
        ],

        "dataRowMutations"=>[

         /* "usage_count" => [
              "type" => "count",
              "table" => "nudge_cards",
              "link"  => "template_id:record_id"
          ],*/ 
                 
          
        ],

      
    ],


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "nudge_card_templates" => ["primkey","record_id","template_name","template_type","html_content","css_content","status","created_at"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "nudge_card_templates" => [
                "Template Details" => ["template_name","template_type","status"],
                "Design Content" => ["html_content","css_content"],
                "System Information" => ["created_at"]
            ]
        ],


        "image_columns" => [],
        "default_col_class" => "col-md-4",
        "hidden_inputs" => [], 
        "print_tables" => ["nudge_card_templates"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","html_content","css_content"],  
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => [], 
        "textarea_array" => ["css_content"], 
        "content_editable" => ["html_content"], 

        "static_drop_down_array" => [
            "status" => "active,inactive",
            "template_type" => "promo,reminder,alert,custom"
        ],

        "dynamic_drop_down_array" => [], 
        "password_columns" => [], 
        "title_columns" => [], 
        "date_columns" => [],
        "datetime_columns" => ["created_at"],

        "rename_cols_array" => [ 
            "created_at" => "Created Date"
        ],

        "rename_tables_array" => [
            "nudge_card_templates" => "Nudge Card Templates"
        ],

        "new_label_buttons_arr" => [ 
            "nudge_card_templates" => "layout:New Template:{`Template Profile / \${nudge_card_templatesNode?.template_name}`}"
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "nudge_card_templates"=>["csv"=>"template_name,template_type,html_content,css_content,status","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
        //this will add cehck boxes on each row   
       "add_grid_check_boxes"=>[
          "nudge_card_templates"=>"loadTemplates()"
        ],
                 
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        // A custom_multi_grid_rows uses data extracted from dataRowMutations 
        "custom_multi_grid_rows" => [
          /*"template_usage"=>[
            "table"=>"nudge_cards",
            "link"=>"cards_list",
            "query"=>"template_id='{{record_id}}'",
            "title"=>"Cards Using This Template",
            "columns"=>["card_title","status","created_at"]
          ]*/
        ], 
      
        "custom_profile_col_data" => [
        ], 
      
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
        ]
    ]
  
  ];
//filterfile, title, table, column
  /// Ai Notes  button you want on the list page dont remove commented code replace instead
  $list_btn_table_array=[
      $primary_table__=>[
         /*"calendar: Filter by Creation Date" => [
             "fe" => "filterByDate(`../nudgecardtemplates/apilist`,`Filter creation date`, `nudge_card_templates`,`created_at`)",
             "be" => "filterByDate()",
             "file" => "nudge-template-filters"
         ]*/      
      ],  
  ];

  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[
      $primary_table__=>[
         /*"copy: Duplicate Template" => [
             "fe" => "duplicateTemplate(nudge_card_templatesNode)",
             "be" => "duplicateTemplate()",
             "file" => "nudge-template-actions"
         ]*/        
      ],
  ];

  ////Ai Notes  on each row you add more actions eg, view collections, send message dont remove commented code replace instead
  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         /*"eye: View Cards Using Template" => [
             "fe" => "viewCardsByTemplate(listnudge_card_templates_result.record_id)",
             "file" => "nudge-template-details"
         ]*/        
      ]
  ];

  ///Ai Notes  append mini list for interlinked data eg farmers & collections dont remove commented code replace instead
  $interlink_lists=[
  /* "templateCards"=>[ 
     "filter_str"=>" template_id='\${nudge_card_templatesNode?.record_id}'  ",
     "module_name"=>"NudgeCards",
     "list_title"=>"Generated Cards",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'nudge_cards', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ]*/
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   
  ];  

  ///for interlinked data included as component
  $customProfileData="{}";

  ///=================================== basic template setup 

  $override_def_col_size="col-md-4 hive_data_cell ";
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
  ///=================================== basic template setup 

?>
