import { v4 as uuid_v4 } from "uuid"



export function get_new_id ()
{
    return uuid_v4()
}
export const get_new_prediction_id = () => "pr" + get_new_id()
export const get_new_value_and_prediction_set_id = () => "vps" + get_new_id()
export const get_new_VAP_id = () => "VAP" + get_new_id()
