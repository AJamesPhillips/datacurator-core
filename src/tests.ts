/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/await-thenable */
// Explored using https://github.com/kvendrik/jest-lite to run the tests but
// this doesn't look like it is being maintained any more.

import { test_get_tense_of_uncertain_datetime } from "./shared/datetime/get_tense_of_uncertain_datetime.test";
import { test_partition_items_by_created_at_datetime } from "./shared/datetime/partition_by_created_at.test";
import { test_partition_sorted_items_by_datetimes, test_sort_by_uncertain_event_datetimes } from "./shared/datetime/partition_by_uncertain_datetime.test";
import { test_get_ids_from_text, test_id_regexs } from "./sharedf/rich_text/id_regexs.test";


// in the browser and in automated tests for running in this like Github actions
export async function run_all_tests()
{
    ;(await test_get_tense_of_uncertain_datetime)()
    ;(await test_partition_items_by_created_at_datetime)()
    ;(await test_partition_sorted_items_by_datetimes)()
    ;(await test_sort_by_uncertain_event_datetimes)()
    ;(await test_id_regexs)()
    ;(await test_get_ids_from_text)()
}
