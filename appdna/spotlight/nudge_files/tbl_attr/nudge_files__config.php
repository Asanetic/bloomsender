<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

////1. nudge_files

//"primkey" , "record_id" , "title" , "content" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , <br><br>


//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, full_name, email, phone_number, account_status, country, created_at    
//important columns on profile : record_id, first_name, last_name, full_name, email, phone_number, account_status, email_verified, phone_verified, country, currency, created_at, updated_at    

/*================= How the module related to the whole app / app flow ==================== 

This module manages the core user accounts for the application. It handles user registration,
authentication, profile management, and account verification. Users created here are linked to
billing accounts, subscriptions, orders, and payment records throughout the system.

Key relationships:
- Linked to billing accounts via account_id
- Referenced in orders, payments, and subscriptions
- Controls access to assets through entitlements

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of app_users please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable . :contentReference[oaicite:0]{index=0}
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="nudge_files";
  $__page_title ="Nudge Files";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"nudgefiles",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"nudgefiles",
    "multigrid_col_span"=>"9"      

  ];
  
  $modules_and_links_=[
 
    //form data page eg users/profile leave as profile    
    "profile_module_name"=>"profile", 
    "profile_module_link"=>"../nudgecards/customcontent",
    "addnew_page_link"=>"../nudgecards/customcontent",
    
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
  $list_template= file_get_contents('../novatemplates/dna_mini_card_list_no_img.tdna');
  //$list_template= file_get_contents('../novatemplates/dna_grid3.tdna');
  
  //custom profile ui template path
  //$profile_template= file_get_contents('../novatemplates/bgprofile.tdna');
  //$profile_template= file_get_contents('../novatemplates/profile8.tdna');

  /*
  The data Dictionary only applies if you selected a custom list ($csgrid_dictionary) or profile ($profile_dictionary) template 
  $for list we use $list_template for profile we use $profile_dictionary. Dont uncomment if you dont have the template
  if not selected the compiler defaults to the inbuild template
  |-------------------------------------------------------------------------- 
  */

  $csgrid_dictionary = [

      "data1" => "title",
      "data2" => "content",
      "data3" => "created_at",
      "data4" => "updated_at"

  ];


  $profile_dictionary = [

      "data1" => "title",
      "data2" => "content",
      "data3" => "created_at",
      "data4" => "updated_at"

  ];


  $input_prefix="";

  $novanest_module_ui_blueprint_ = [

    "db_schema" => [

        "custom_tbl_cols" => [
           //"nudge_files" => ["extra_field"]
        ],

        "custom_profile_default_data" => [
            //"status" => "active"
        ],

        "dataRowMutations"=>[

         /* existing commented code preserved */ 
                 
          
        ],

      
    ],


    "page_layout" => [

        "desired_column_order" => [
            "nudge_files" => ["primkey","record_id","title","content","created_at","updated_at"]
        ],

        "form_input_segmentation_arr" => [
            "nudge_files" => [
                "Nudge Info" => ["title","content"],
                "System Info" => ["created_at","updated_at"]
            ]
        ],


        "image_columns" => [],
        "default_col_class" => "col-md-4",
        "hidden_inputs" => ["updated_at"], 
        "print_tables" => ["nudge_files"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"],
        "skip_cols_list" => ["hive_site_id","hive_site_name","updated_at"],
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => [], 
        "textarea_array" => ["content"], 
        "content_editable" => [], 

        "static_drop_down_array" => [],

        "dynamic_drop_down_array" => [], 
        "password_columns" => [], 
        "title_columns" => ["title"], 
        "date_columns" => [],
        "datetime_columns" => ["created_at","updated_at"],

        "rename_cols_array" => [ 
            "created_at" => "Created",
            "updated_at" => "Updated",
        ],

        "rename_tables_array" => [
            "nudge_files" => "Nudge Files"
        ],

        "new_label_buttons_arr" => [ 
            "nudge_files" => "file-plus:New File:{`Nudge File / \${nudge_filesNode?.title}`}"
        ],

        "profile_pic_style" => ""
    ],
    
    "import"=>[
      "nudge_files"=>["csv"=>"title,content","record_id"=>""]
    ],

    "data_behaviour" => [
       "add_grid_check_boxes"=>[
          "nudge_files"=>"loadNudgeFiles()"
        ],
                 
        "custom_multi_grid_rows" => [
          /* existing commented code preserved */
        ], 
      
        "custom_profile_col_data" => [
        ], 
      
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
        ]
    ]
  
  ];

  $list_btn_table_array=[
      $primary_table__=>[
         /* existing commented code preserved */      
      ],  
  ];

  $profile_btn_table_array=[
      $primary_table__=>[
         /* existing commented code preserved */        
      ],
  ];

  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         /* existing commented code preserved */        
      ]
  ];

  $interlink_lists=[
  /* existing commented code preserved */
  ];
   
  $interlink_profile=[
   /* existing commented code preserved */
  ];  

  $customProfileData="{}";

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

?>
