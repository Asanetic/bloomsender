
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert message_templates 
export async function AddMessagetemplates(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("message_templates", mutatedDataArray, body);
   
  return result;
}


//update message_templates 
export async function UpdateMessagetemplates(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("message_templates", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete message_templates 
export async function DeleteMessagetemplates(tokenId, whereStr)
{  
  const result = await mosySqlDelete("message_templates", whereStr);

  return result;
}

