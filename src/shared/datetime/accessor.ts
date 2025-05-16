import { get_uncertain_datetime } from "../uncertainty/datetime"
import type { HasUncertainDatetime } from "../uncertainty/interfaces"



export function get_created_at_datetime (obj: { created_at: Date, custom_created_at?: Date }): Date
{
    return obj.custom_created_at || obj.created_at
}


export function get_created_at_ms (obj: { created_at: Date, custom_created_at?: Date }): number
{
    return get_created_at_datetime(obj).getTime()
}



export function get_sim_datetime (item: HasUncertainDatetime)
{
    return get_uncertain_datetime(item.datetime)
}

export function get_sim_datetime_ms (item: HasUncertainDatetime)
{
    const dt = get_sim_datetime(item)
    return dt === undefined ? undefined : dt.getTime()
}
