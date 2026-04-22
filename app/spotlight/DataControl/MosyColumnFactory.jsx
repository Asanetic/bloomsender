const MosyColumnFactory = {

   //-- clients cols--//
  clients: ["client_id", "client_name", "client_email", "client_tel", "client_location", "client_photo", "gender", "date_registered", "password", "admin_id", "hive_site_id", "hive_site_name", "industry", "status"],

   //-- message_templates cols--//
  message_templates: ["record_id", "template_name", "message_subject", "message_template", "template_code", "hive_site_id", "hive_site_name"],

   //-- messaging cols--//
  messaging: ["messageid", "receiver_contacts", "receiver_tel", "receiver_email", "reciver_names", "message_type", "site_id", "group_name", "message_date", "sent_state", "msg_read_state", "subject", "message_label", "message_details", "sms_cost", "page_count", "hive_site_id", "hive_site_name", "custom_dictionary", "message_signature", "ref_number"],

   //-- mosy_sql_roll_back cols--//
  mosy_sql_roll_back: ["roll_bk_key", "table_name", "roll_type", "where_str", "roll_timestamp", "value_entries", "hive_site_id", "hive_site_name"],

   //-- page_manifest_ cols--//
  page_manifest_: ["manikey", "page_group", "site_id", "page_url", "hive_site_id", "hive_site_name", "project_id", "project_name"],

   //-- system_module_manifest_ cols--//
  system_module_manifest_: ["record_id", "component_name", "module_key", "module_name", "permission_type", "capability_key", "access_name", "relative_path", "hive_site_id", "hive_site_name"],

   //-- system_role_bundles cols--//
  system_role_bundles: ["record_id", "bundle_id", "bundle_name", "remark", "hive_site_id", "hive_site_name"],

   //-- system_users cols--//
  system_users: ["record_id", "name", "email", "tel", "login_password", "ref_id", "regdate", "user_no", "user_pic", "user_gender", "last_seen", "about", "hive_site_id", "hive_site_name", "auth_token", "token_status", "token_expiring_in", "project_id", "project_name", "user_role"],

   //-- user_bundle_role_functions cols--//
  user_bundle_role_functions: ["record_id", "bundle_id", "bundle_name", "role_id", "role_name", "remark", "hive_site_id", "hive_site_name"],

   //-- user_manifest_ cols--//
  user_manifest_: ["admin_mkey", "user_id", "user_name", "role_id", "site_id", "role_name", "hive_site_id", "hive_site_name", "project_id", "project_name"],


};
export default MosyColumnFactory;