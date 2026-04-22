
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert messaging 
export async function AddMessageoutbox(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("messaging", mutatedDataArray, body);
   
  return result;
}


//update messaging 
export async function UpdateMessageoutbox(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("messaging", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete messaging 
export async function DeleteMessageoutbox(tokenId, whereStr)
{  
  const result = await mosySqlDelete("messaging", whereStr);

  return result;
}

