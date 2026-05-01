
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert nudge_cards 
export async function AddNudgecards(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("nudge_cards", mutatedDataArray, body);
   
  return result;
}


//update nudge_cards 
export async function UpdateNudgecards(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("nudge_cards", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete nudge_cards 
export async function DeleteNudgecards(tokenId, whereStr)
{  
  const result = await mosySqlDelete("nudge_cards", whereStr);

  return result;
}

