
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert nudge_card_templates 
export async function AddNudgecardtemplates(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("nudge_card_templates", mutatedDataArray, body);
   
  return result;
}


//update nudge_card_templates 
export async function UpdateNudgecardtemplates(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("nudge_card_templates", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete nudge_card_templates 
export async function DeleteNudgecardtemplates(tokenId, whereStr)
{  
  const result = await mosySqlDelete("nudge_card_templates", whereStr);

  return result;
}

