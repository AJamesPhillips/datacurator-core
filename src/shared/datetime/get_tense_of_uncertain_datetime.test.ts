import { describe, test } from "../../utils/test"
import { Tense } from "../../wcomponent/interfaces/datetime"
import { get_tense_of_uncertain_datetime } from "./get_tense_of_uncertain_datetime"


export const test_get_tense_of_uncertain_datetime = describe.delay("get_tense_of_uncertain_datetime", () =>
{
    let result: Tense

    const date1 = new Date("2021-04-01 00:01")
    const date1_ms = date1.getTime()
    const date2 = new Date("2021-04-01 00:02")
    const date2_ms = date2.getTime()
    const date3 = new Date("2021-04-01 00:03")
    const date3_ms = date3.getTime()
    const date4 = new Date("2021-04-01 00:04")
    const date4_ms = date4.getTime()
    const date5 = new Date("2021-04-01 00:05")
    const date5_ms = date5.getTime()

    result = get_tense_of_uncertain_datetime({ datetime: {} }, date1_ms)
    test(result, Tense.eternal)

    result = get_tense_of_uncertain_datetime({ datetime: { min: date2 } }, date1_ms)
    test(result, Tense.future)
    result = get_tense_of_uncertain_datetime({ datetime: { min: date2 } }, date2_ms)
    test(result, Tense.present)
    result = get_tense_of_uncertain_datetime({ datetime: { min: date2 } }, date3_ms)
    test(result, Tense.present)

    result = get_tense_of_uncertain_datetime({ datetime: { value: date2 } }, date1_ms)
    test(result, Tense.future)
    result = get_tense_of_uncertain_datetime({ datetime: { value: date2 } }, date2_ms)
    test(result, Tense.present)
    result = get_tense_of_uncertain_datetime({ datetime: { value: date2 } }, date3_ms)
    test(result, Tense.past)

    result = get_tense_of_uncertain_datetime({ datetime: { max: date2 } }, date1_ms)
    test(result, Tense.present)
    result = get_tense_of_uncertain_datetime({ datetime: { max: date2 } }, date2_ms)
    test(result, Tense.past)
    result = get_tense_of_uncertain_datetime({ datetime: { max: date2 } }, date3_ms)
    test(result, Tense.past)


    result = get_tense_of_uncertain_datetime({ datetime: { min: date2, max: date3 } }, date1_ms)
    test(result, Tense.future)
    result = get_tense_of_uncertain_datetime({ datetime: { min: date2, max: date3 } }, date2_ms)
    test(result, Tense.present)
    result = get_tense_of_uncertain_datetime({ datetime: { min: date2, max: date3 } }, date3_ms)
    test(result, Tense.past)
    result = get_tense_of_uncertain_datetime({ datetime: { min: date2, max: date3 } }, date4_ms)
    test(result, Tense.past)

    result = get_tense_of_uncertain_datetime({ datetime: { min: date2, value: date3, max: date4 } }, date1_ms)
    test(result, Tense.future)
    result = get_tense_of_uncertain_datetime({ datetime: { min: date2, value: date3, max: date4 } }, date2_ms)
    test(result, Tense.present)
    result = get_tense_of_uncertain_datetime({ datetime: { min: date2, value: date3, max: date4 } }, date3_ms)
    test(result, Tense.present)
    result = get_tense_of_uncertain_datetime({ datetime: { min: date2, value: date3, max: date4 } }, date4_ms)
    test(result, Tense.past)
    result = get_tense_of_uncertain_datetime({ datetime: { min: date2, value: date3, max: date4 } }, date5_ms)
    test(result, Tense.past)

})
