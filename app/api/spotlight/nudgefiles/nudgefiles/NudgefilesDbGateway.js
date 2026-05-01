
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert nudge_files 
export async function AddNudgefiles(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("nudge_files", mutatedDataArray, body);
   
  return result;
}


//update nudge_files 
export async function UpdateNudgefiles(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("nudge_files", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete nudge_files 
export async function DeleteNudgefiles(tokenId, whereStr)
{  
  const result = await mosySqlDelete("nudge_files", whereStr);

  return result;
}

