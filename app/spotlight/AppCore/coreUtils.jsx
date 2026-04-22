import { mosy_push_data } from "../../MosyUtils/hiveUtils";


export function loadClient (dataRes, handler)
{
  //Table name : clients

// columns : "primkey" , "client_id" , "client_name" , "client_email" , "client_tel" , "client_location" , "client_photo" , "gender" , "date_registered" , "password" , "admin_id" , "hive_site_id" , "hive_site_name" , "industry" , "status" , 

//Table name : messaging

// columns : "primkey" , "messageid" , "receiver_contacts" , "receiver_tel" ,
//  "receiver_email" , "reciver_names" , "message_type" , "site_id" , 
// "group_name" , "message_date" , "sent_state" , "msg_read_state" , "subject" , 
// "message_label" , "message_details" , "sms_cost" , "page_count" , "hive_site_id" ,
//  "hive_site_name" , "custom_dictionary" , "message_signature" , "ref_number" , 


  handler("receiver_contacts", `${dataRes.client_name} ${dataRes.client_email} ${dataRes.client_tel}`);  
  handler("receiver_email", dataRes.client_email);
  handler("receiver_tel", dataRes.client_tel);
}