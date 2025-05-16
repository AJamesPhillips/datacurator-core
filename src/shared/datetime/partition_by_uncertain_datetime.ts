import { SortDirection, sort_list } from "../../utils/sort"
import { Tense } from "../../wcomponent/interfaces/datetime"
import { uncertain_datetime_is_eternal } from "../uncertainty/datetime"
import type { HasUncertainDatetime } from "../uncertainty/interfaces"
import { get_tense_of_uncertain_datetime } from "./get_tense_of_uncertain_datetime"



interface PartitionItemsByDatetimeArgs<U>
{
    items: U[]
    sim_ms: number
}
/*
 * This function:
 *   1. sorts the values by newest to oldest event
 *   2. treats the uncertain datetime as the time when the state changed
 */
export function partition_and_sort_by_uncertain_event_datetimes <U extends HasUncertainDatetime> (args: PartitionItemsByDatetimeArgs<U>): PartitionItemsByDatetimeReturn<U>
{
    const { items, sim_ms } = args

    const sorted_items = sort_by_uncertain_event_datetimes(items)

    return partition_sorted_items_by_datetimes({ sorted_items, sim_ms })
}



export function sort_by_uncertain_event_datetimes <U extends HasUncertainDatetime> (items: U[], direction = SortDirection.descending): U[]
{

    const sorted_items = sort_list(items, ({ datetime }) =>
    {
        if (uncertain_datetime_is_eternal(datetime)) return Number.NEGATIVE_INFINITY
        const { max, value, min } = datetime

        if (min) return min.getTime() * 10 + 2
        if (value) return value.getTime() * 10 + 1
        if (max) return max.getTime() * 10

        return 1
    }, direction)

    return sorted_items
}



export interface PartitionSortedItemsByDatetimeArgs<U>
{
    sorted_items: U[]
    sim_ms: number
}
export interface PartitionItemsByDatetimeReturn<U>
{
    past_items: U[]
    present_item: U | undefined
    future_items: U[]
}
export function partition_sorted_items_by_datetimes <U extends HasUncertainDatetime> (args: PartitionSortedItemsByDatetimeArgs<U>): PartitionItemsByDatetimeReturn<U>
{
    const { sorted_items, sim_ms } = args

    let past_items: U[] = []
    let present_items: U[] = []
    let eternal_items: U[] = []
    const future_items: U[] = []


    sorted_items.forEach(item =>
    {
        const tense = get_tense_of_uncertain_datetime(item, sim_ms)

        if (tense === Tense.past) past_items.push(item)
        else if (tense === Tense.future) future_items.push(item)
        else if (tense === Tense.present) present_items.push(item)
        else eternal_items.push(item)
    })


    if (present_items.length !== 1)
    {
        if (present_items.length > 1)
        {
            const older_present_items = present_items.slice(1)
            past_items = older_present_items.concat(past_items)
            present_items = present_items.slice(0, 1)
        }
        else if (past_items.length)
        {
            present_items = past_items.slice(0, 1)
            past_items = past_items.slice(1)
        }
    }


    if (eternal_items.length)
    {
        if (present_items.length !== 1)
        {
            present_items = eternal_items.slice(0, 1)
            eternal_items = eternal_items.slice(1)
        }

        past_items = past_items.concat(eternal_items)
    }


    const present_item = present_items[0]

    return { past_items, present_item, future_items }
}
