import { Tense } from "../../wcomponent/interfaces/datetime"
import type { HasUncertainDatetime } from "../uncertainty/interfaces"



export function get_tense_of_uncertain_datetime (item: HasUncertainDatetime, sim_ms: number): Tense
{
    // TODO: document why item.datetime might be undefined and or update types / data in DB
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const { min, value, max } = (item.datetime || {})

    const [have_min, min_ms] = min === undefined ? [false, 0] : [true, min.getTime()]
    const [have_value, value_ms] = value === undefined ? [false, 0] : [true, value.getTime()]
    const [have_max, max_ms] = max === undefined ? [false, 0] : [true, max.getTime()]

    if (have_min)
    {
        if (min_ms > sim_ms) return Tense.future
        if (min_ms === sim_ms) return Tense.present
        if (!have_max && min_ms < sim_ms) return Tense.present
    }

    if (have_max)
    {
        if (max_ms <= sim_ms) return Tense.past
        return Tense.present
    }

    if (have_value)
    {
        if (value_ms < sim_ms) return Tense.past
        if (value_ms === sim_ms) return Tense.present
        if (value_ms > sim_ms) return Tense.future
    }

    return Tense.eternal
}
