<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

////1. nudge_cards

//"primkey" , "record_id" , "client_id" , "template_id" , "card_title" , "card_data" , "generated_image_path" , "status" , "created_at" , "hive_site_id" , "hive_site_name" , <br><br>


//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, full_name, email, phone_number, account_status, country, created_at    
//important columns on profile : record_id, first_name, last_name, full_name, email, phone_number, account_status, email_verified, phone_verified, country, currency, created_at, updated_at    

/*================= How the module related to the whole app / app flow ==================== 

This module manages generated nudge cards for users. It handles creation of dynamic content cards,
storage of card data, generated images, and lifecycle status tracking.

Key relationships:
- Linked to clients via client_id
- Uses templates via template_id
- Stores generated media and structured card data

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of app_users please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .

  // =========================
  // Core definitions
  // =========================
  $primary_table__="nudge_cards";
  $__page_title ="Nudge Cards";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"nudgecards",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"nudgecards",
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

  $csgrid_dictionary = [

      "data1" => "generated_image_path",
      "data2" => "card_title",
      "data3" => "status",
      "data4" => "client_id"

  ];

  $profile_dictionary = [

      "data1" => "generated_image_path",
      "data2" => "card_title",
      "data3" => "card_data",
      "data4" => "status"

  ];


  $input_prefix="";

  $novanest_module_ui_blueprint_ = [

    "db_schema" => [

        "custom_tbl_cols" => [
           //"nudge_cards" => ["total_views","total_clicks"]
        ],

        "custom_profile_default_data" => [
            //"status" => "active"
        ],

        "dataRowMutations"=>[
                 
        ],

      
    ],

    "page_layout" => [

        "desired_column_order" => [
            "nudge_cards" => ["primkey","record_id","client_id","template_id","card_title","card_data","generated_image_path","status","created_at"]
        ],

        "form_input_segmentation_arr" => [
            "nudge_cards" => [
                "Card Information" => ["card_title","card_data","template_id"],
                "Media" => ["generated_image_path"],
                "Status" => ["status"],
                "System Information" => ["created_at"]
            ]
        ],

        "image_columns" => ["generated_image_path"],
        "default_col_class" => "col-md-4",
        "hidden_inputs" => [], 
        "print_tables" => ["nudge_cards"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","card_data"],  
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => [], 
        "textarea_array" => ["card_data"], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "status" => "active,inactive,archived"
        ],

        "dynamic_drop_down_array" => [], 
        "password_columns" => [], 
        "title_columns" => [], 
        "date_columns" => [],
        "datetime_columns" => ["created_at"],

        "rename_cols_array" => [ 
            "created_at" => "Created Date",
            "client_id" => "Client"
        ],

        "rename_tables_array" => [
            "nudge_cards" => "Nudge Cards"
        ],

        "new_label_buttons_arr" => [ 
            "nudge_cards" => "image:New Card:{`Card Profile / \${nudge_cardsNode?.card_title}`}"
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "nudge_cards"=>["csv"=>"client_id,template_id,card_title,card_data,status","record_id"=>""]
    ],

    "data_behaviour" => [
       "add_grid_check_boxes"=>[
          "nudge_cards"=>"loadCards()"
        ],
                 
        "custom_multi_grid_rows" => [
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
      ],  
  ];

  $profile_btn_table_array=[
      $primary_table__=>[
      ],
  ];

  $global_new_drop_down_link_arr = [
        $primary_table__=>[
      ]
  ];

  $interlink_lists=[
  ];
   
  $interlink_profile=[
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
