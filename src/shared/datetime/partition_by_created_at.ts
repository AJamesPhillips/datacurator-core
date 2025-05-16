import type { Base } from "../../interfaces/base"
import { get_created_at_ms } from "./accessor"


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
