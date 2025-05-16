import type { Base } from "../../interfaces/base"
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





export interface PartitionItemsByCreatedAtDatetimeArgs<U>
{
    items: U[]
    created_at_ms: number
}
export interface PartitionItemsByCreatedAtDatetimeReturn<U>
{
    invalid_future_items: U[]
    current_items: U[]
}
export function partition_items_by_created_at_datetime <U extends Base> (args: PartitionItemsByCreatedAtDatetimeArgs<U>): PartitionItemsByCreatedAtDatetimeReturn<U>
{
    const { items, created_at_ms } = args

    const invalid_future_items: U[] = []
    const current_items: U[] = []

    items.forEach(item =>
    {
        if (get_created_at_ms(item) > created_at_ms)
        {
            invalid_future_items.push(item)
        }
        else
        {
            current_items.push(item)
        }
    })


    return { invalid_future_items, current_items }
}
