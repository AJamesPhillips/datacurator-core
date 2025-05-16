import { describe, test } from "../../utils/test"
import type { HasUncertainDatetime } from "../uncertainty/interfaces"
import {
    partition_sorted_items_by_datetimes,
    PartitionItemsByDatetimeReturn,
    PartitionSortedItemsByDatetimeArgs,
    sort_by_uncertain_event_datetimes,
} from "./partition_by_uncertain_datetime"


export const test_partition_sorted_items_by_datetimes = describe.delay("partition_sorted_items_by_datetimes", () =>
{

    interface Simple extends HasUncertainDatetime { id: string }

    function helper_func__ids_partition_sorted_items_by_datetimes (args: PartitionSortedItemsByDatetimeArgs<Simple>): PartitionItemsByDatetimeReturn<string>
    {
        const result = partition_sorted_items_by_datetimes(args)
        return {
            past_items: result.past_items.map(({ id }) => id),
            present_item: result.present_item?.id,
            future_items: result.future_items.map(({ id }) => id),
        }
    }


    let sorted_items: Simple[]
    let result: PartitionItemsByDatetimeReturn<string>

    const date0 = new Date("2021-04-01 00:00")
    const date0_ms = date0.getTime()
    const date1 = new Date("2021-04-01 00:01")
    const date1_ms = date1.getTime()
    const date2 = new Date("2021-04-01 00:02")
    const date2_ms = date2.getTime()
    const date3 = new Date("2021-04-01 00:03")
    const date3_ms = date3.getTime()


    sorted_items = []
    result = helper_func__ids_partition_sorted_items_by_datetimes({ sorted_items, sim_ms: date3_ms })
    test(result, {
        past_items: [],
        present_item: undefined,
        future_items: [],
    })


    sorted_items = [
        { id: "10", datetime: {} }, // eternal
        { id: "11", datetime: {} }, // eternal
    ]
    result = helper_func__ids_partition_sorted_items_by_datetimes({ sorted_items, sim_ms: date0_ms })
    test(result, {
        past_items: ["11"],
        present_item: "10",
        future_items: [],
    }, "Can handle multiple eternal elements")


    sorted_items = [
        { id: "30", datetime: { value: date2 } },
        { id: "20", datetime: { value: date1 } },
        { id: "10", datetime: {} },
    ]
    result = helper_func__ids_partition_sorted_items_by_datetimes({ sorted_items, sim_ms: date0_ms })
    test(result, {
        past_items: [],
        present_item: "10",
        future_items: ["30", "20"],
    }, "Should partition eternal item as present if other items are in the future")

    result = helper_func__ids_partition_sorted_items_by_datetimes({ sorted_items, sim_ms: date1_ms })
    test(result, {
        past_items: ["10"],
        present_item: "20",
        future_items: ["30"],
    }, "Should partition eternal item as past if other items are in the present")

    result = helper_func__ids_partition_sorted_items_by_datetimes({ sorted_items, sim_ms: date2_ms })
    test(result, {
        past_items: ["20", "10"],
        present_item: "30",
        future_items: [],
    }, "Should partition eternal item and other past items as past if other items are in the present")

    result = helper_func__ids_partition_sorted_items_by_datetimes({ sorted_items, sim_ms: date3_ms })
    test(result, {
        past_items: ["20", "10"],
        present_item: "30",
        future_items: [],
    })

    sorted_items = [{ id: "40", datetime: { min: date1 } }]
    result = helper_func__ids_partition_sorted_items_by_datetimes({ sorted_items, sim_ms: date1_ms })
    test(result, {
        past_items: [],
        present_item: "40",
        future_items: [],
    }, "Should find min datetime as present when sim_ms is equal to min datetime")

    result = helper_func__ids_partition_sorted_items_by_datetimes({ sorted_items, sim_ms: date0_ms })
    test(result, {
        past_items: [],
        present_item: undefined,
        future_items: ["40"],
    }, "Should find min datetime as future when sim_ms is before min datetime")


    sorted_items = [{ id: "50", datetime: { max: date1 } }]
    result = helper_func__ids_partition_sorted_items_by_datetimes({ sorted_items, sim_ms: date1_ms })
    test(result, {
        past_items: [],
        present_item: "50",
        future_items: [],
    }, "Should find max datetime as present when sim_ms is equal to max datetime")

    sorted_items = [
        { id: "50", datetime: { max: date1 } },
        { id: "60", datetime: { max: date1 } },
    ]
    result = helper_func__ids_partition_sorted_items_by_datetimes({ sorted_items, sim_ms: date2_ms })
    test(result, {
        past_items: ["60"],
        present_item: "50", // should this be the required behaviour? todo: double check this makes sense then document in future detail
        future_items: [],
    }, "Should find max datetime as past when sim_ms is later than max datetime but when no other item is present, will use one as present item")

    // See test_get_tense_of_uncertain_datetime for more tests regarding segmenting items by datetime
})



export const test_sort_by_uncertain_event_datetimes = describe.delay("sort_by_uncertain_event_datetimes", () =>
{

    interface Simple extends HasUncertainDatetime { id: string }

    function helper_func__ids_sort_by_uncertain_event_datetimes (items: Simple[])
    {
        const result = sort_by_uncertain_event_datetimes(items)
        return result.map(({ id }) => id)
    }


    function helper_func__compare (items: Simple[], expected: Simple[])
    {
        const items_reverse = [...items].reverse()
        const expected_ids = expected.map(({ id }) => id)

        result = helper_func__ids_sort_by_uncertain_event_datetimes(items)
        const result2 = helper_func__ids_sort_by_uncertain_event_datetimes(items_reverse)

        // Should get same result from items forwards or backwards
        test(result, result2, "", false)
        // console .log(items.map(({ id }) => id).join(", "))
        test(result, expected_ids, "", false)
    }


    let items: Simple[] = []
    let result: string[]
    let expected: Simple[]

    const date0 = new Date("2021-04-01 00:00")
    const date1 = new Date("2021-04-01 00:01")
    const date2 = new Date("2021-04-01 00:02")
    const date3 = new Date("2021-04-01 00:03")

    let id = 0
    const next_id = () => `${id++}`
    const s_eternal: Simple = { id: next_id(), datetime: {} }
    const s_eternal2: Simple = { id: next_id(), datetime: {} }
    const s1: Simple = { id: next_id(), datetime: { value: date1 } }
    const s2: Simple = { id: next_id(), datetime: { value: date2 } }
    const s_max1: Simple = { id: next_id(), datetime: { max: date1 } }
    const s_max2: Simple = { id: next_id(), datetime: { max: date2 } }
    const s_min1: Simple = { id: next_id(), datetime: { min: date1 } }
    const s_min2: Simple = { id: next_id(), datetime: { min: date2 } }

    const s_min0_max3: Simple = { id: next_id(), datetime: { min: date0, max: date3 } }
    const s_min1_max2: Simple = { id: next_id(), datetime: { min: date1, max: date2 } }


    items = []
    result = helper_func__ids_sort_by_uncertain_event_datetimes(items)
    test(result, [], "", false)


    // Not sure how to deal with multiple eternal entries so testing that sort is indeterminant for now
    items = [s_eternal, s_eternal2]
    const items_reverse = [...items].reverse()
    result = helper_func__ids_sort_by_uncertain_event_datetimes(items)
    const result2 = helper_func__ids_sort_by_uncertain_event_datetimes(items_reverse)
    test(JSON.stringify(result) !== JSON.stringify(result2), true, "Should be different (indeterminant sort)")


    items = [s_eternal, s1, s2]
    expected = [s2, s1, s_eternal]
    helper_func__compare(items, expected)


    items = [s_eternal, s_min1, s_min2]
    expected = [s_min2, s_min1, s_eternal]
    helper_func__compare(items, expected)


    items = [s_eternal, s_max1, s_max2]
    expected = [s_max2, s_max1, s_eternal]
    helper_func__compare(items, expected)


    items = [s_eternal, s1, s2, s_min1, s_min2, s_max1, s_max2]
    expected = [s_min2, s2, s_max2, s_min1, s1, s_max1, s_eternal]
    helper_func__compare(items, expected)


    items = [s_eternal, s_min0_max3, s_min1_max2]
    expected = [s_min1_max2, s_min0_max3, s_eternal]
    helper_func__compare(items, expected)

})
