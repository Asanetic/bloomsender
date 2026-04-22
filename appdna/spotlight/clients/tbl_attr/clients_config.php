<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

////1. clients

//"primkey" , "client_id" , "client_name" , "client_email" , "client_tel" , "client_location" , "client_photo" , "gender" , "date_registered" , "password" , "admin_id" , "hive_site_id" , "hive_site_name" , <br><br>


//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : client_id, client_name, client_email, client_tel, client_location, gender, date_registered    
//important columns on profile : client_id, client_name, client_email, client_tel, client_location, gender, date_registered, client_photo    

/*================= How the module related to the whole app / app flow ==================== 

This module manages client records for the application. It handles client registration,
profile management, and client contact tracking. Clients created here are linked to
orders, payments, and service records throughout the system.

Key relationships:
- Linked to transactions via client_id
- Referenced in orders, invoices, and payments
- Used for reporting and communication tracking

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of app_users please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
///A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="clients";
  $__page_title ="Phonebook";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"clients",     
    "primary_key"=>"primkey",
    "record_id"=>"client_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"clients",
    "multigrid_col_span"=>"9"      

  ];
  
  $modules_and_links_=[
 
    //form data page eg clients/profile leave as profile    
    "profile_module_name"=>"profile", 
    "profile_module_link"=>"./profile",
    "addnew_page_link"=>"./profile",
    
    //list / grid data page eg clients/list leave as list
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
  $list_template= file_get_contents('../novatemplates/dna_mini_card_list.tdna');
  //$list_template= file_get_contents('../novatemplates/dna_grid3.tdna');
  
  //custom profile ui template path
  //$profile_template= file_get_contents('../novatemplates/bgprofile.tdna');
  $profile_template= file_get_contents('../novatemplates/dna_profile1.tdna');

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

      "data2" => "client_photo:_",
      "data3" => "client_name",
      "data1" => "client_tel",
      "data4" => "status"

  ];


  /*
  |--------------------------------------------------------------------------
  | Example 2: Profile Dictionary
  |--------------------------------------------------------------------------
  | Notice same data slots, different column mapping.
  */

  $profile_dictionary = [

      "data1" => "client_photo",
      "data2" => "client_name",
      "data3" => "client_email",
      "data4" => "client_location"

  ];


  $input_prefix="";

  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           //"clients" => ["total_orders", "total_payments"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"account_status" => "active"
        ],

        "dataRowMutations"=>[

         /* "total_payments" => [
              "type" => "sum",
              "table" => "payments",
              "link"  => "client_id:client_id",
              "column" => "amount"
          ]*/ 
                 
          
        ],

      
    ],


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "clients" => ["primkey","client_id","client_name","client_email","client_tel","client_location","gender","date_registered","client_photo"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "clients" => [
                "Client Information" => ["client_name","client_email","client_tel","client_location","gender"],
                "Account Settings" => ["password"],
                "System Information" => ["date_registered"]
            ]
        ],


        "image_columns" => ["client_photo"],
        "default_col_class" => "col-md-4",
        "hidden_inputs" => [], 
        "print_tables" => ["clients"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","password"],  
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => [], 
        "textarea_array" => [], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "gender" => "Male,Female"
        ],

        "dynamic_drop_down_array" => [], 
        "password_columns" => ["password"], 
        "title_columns" => [], 
        "date_columns" => ["date_registered"],
        "datetime_columns" => [],

        "rename_cols_array" => [ 
            "client_name" => "Full Name",
            "client_tel" => "Phone Number",
            "client_photo"=>"_",
            "date_registered" => "Registration Date"
        ],

        "rename_tables_array" => [
            "clients" => "Clients"
        ],

        "new_label_buttons_arr" => [ 
            "clients" => "user-plus:New Client:{`Client Profile / \${clientsNode?.client_name}`}"
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "clients"=>["csv"=>"client_name,client_email,client_tel,client_location,gender","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
       "add_grid_check_boxes"=>[
          "clients"=>"loadClients()"
        ],
                 
        "custom_multi_grid_rows" => [
          /*"client_payments"=>[
            "table"=>"payments",
            "link"=>"payments_list",
            "query"=>"client_id='{{client_id}}'",
            "title"=>"Client Payments",
            "columns"=>["date","amount","reference"]
          ]*/
        ], 
      
        "custom_profile_col_data" => [
          //"total_payments"=>"?"
        ], 
      
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           //"client_id" => "orders:client_id:order_name:apiRoutes.orders.base"
        ]
    ]
  
  ];

//filterfile, title, table, column
  $list_btn_table_array=[
      $primary_table__=>[
         /*"filter: Filter Clients" => [
             "fe" => "filterClients()",
             "file" => "clients-filters"
         ]*/      
      ],  
  ];

  $profile_btn_table_array=[
      $primary_table__=>[
         /*"envelope: Contact Client" => [
             "fe" => "contactClient({clientId:clientsNode?.client_id})",
             "file" => "client-contact"
         ]*/        
      ],
  ];

  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         /*"eye: View Orders" => [
             "fe" => "viewClientOrders(listclients_result.client_id)",
             "file" => "client-orders"
         ]*/        
      ]
  ];

  $interlink_lists=[ /* keep structure */ ];
  $interlink_profile=[ /* keep structure */ ];  

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
  $image_style_="elforge_userprofile_template_v1_avatarWrap";
  $mutations=$novanest_module_ui_blueprint_["db_schema"]["dataRowMutations"];
  $image_upload_btn_class="elforge_message_profile_v2_upload_btn_mini";
    
    
    
    
    
    
    
   
?>
