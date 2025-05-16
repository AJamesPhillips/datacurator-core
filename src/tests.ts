/* eslint-disable @typescript-eslint/await-thenable */
// TODO: implement some way to run all tests (also add some more tests :-))
// Perhaps explore using https://github.com/kvendrik/jest-lite to run the tests

import { test_partition_items_by_created_at_datetime } from "./shared/utils_datetime/utils_datetime.test";
import { test_get_ids_from_text, test_id_regexs } from "./sharedf/rich_text/id_regexs.test";


// in the browser and in automated tests for running in this like Github actions
export async function run_all_tests()
{
    ;(await test_partition_items_by_created_at_datetime)()
    ;(await test_id_regexs)()
    ;(await test_get_ids_from_text)()
}
