import type { Base } from "../../interfaces/base"
import { describe, test } from "../../utils/test"
import {
    partition_items_by_created_at_datetime,
    PartitionItemsByCreatedAtDatetimeArgs,
    PartitionItemsByCreatedAtDatetimeReturn,
} from "./partition_by_created_at"


export const test_partition_items_by_created_at_datetime = describe.delay("partition_items_by_created_at_datetime", () =>
{
    type Simple = Base

    function helper_func__ids_partition_items_by_created_at_datetime (args: PartitionItemsByCreatedAtDatetimeArgs<Simple>): PartitionItemsByCreatedAtDatetimeReturn<string>
    {
        const result = partition_items_by_created_at_datetime(args)
        return {
            invalid_future_items: result.invalid_future_items.map(({ id }) => id),
            current_items: result.current_items.map(({ id }) => id),
        }
    }

    let items: Simple[]
    let result: PartitionItemsByCreatedAtDatetimeReturn<string>

    const date0 = new Date("2021-04-01 00:00")
    const date0_ms = date0.getTime()
    const date1 = new Date("2021-04-01 00:01")
    const date1_ms = date1.getTime()
    const date2 = new Date("2021-04-01 00:02")
    const date2_ms = date2.getTime()
    const date3 = new Date("2021-04-01 00:03")
    const date3_ms = date3.getTime()

    const c1: Simple = { base_id: -1, id: "1", created_at: date1 }
    const c2: Simple = { base_id: -1, id: "2", created_at: date2 }

    items = []
    result = helper_func__ids_partition_items_by_created_at_datetime({ items, created_at_ms: date3_ms })
    test(result, {
        invalid_future_items: [],
        current_items: [],
    })

    items = [c1, c2]
    result = helper_func__ids_partition_items_by_created_at_datetime({ items, created_at_ms: date3_ms })
    test(result, {
        invalid_future_items: [],
        current_items: [c1.id, c2.id],
    })

    result = helper_func__ids_partition_items_by_created_at_datetime({ items, created_at_ms: date2_ms })
    test(result, {
        invalid_future_items: [],
        current_items: [c1.id, c2.id],
    })

    result = helper_func__ids_partition_items_by_created_at_datetime({ items, created_at_ms: date1_ms })
    test(result, {
        invalid_future_items: [c2.id],
        current_items: [c1.id],
    })

    result = helper_func__ids_partition_items_by_created_at_datetime({ items, created_at_ms: date0_ms })
    test(result, {
        invalid_future_items: [c1.id, c2.id],
        current_items: [],
    })

})
