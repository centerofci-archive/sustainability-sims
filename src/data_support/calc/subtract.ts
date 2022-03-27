import { units_are_equal, units_to_string } from "../units/utils"
import { Value } from "../value"



export function subtract <T extends Value, T2 extends Value> (value1: T, value2: T2): T
{
    if (!units_are_equal(value1.units, value2.units))
    {
        throw new Error(`Units are not equal.  Can not subtract: "${units_to_string(value1.units)}" and "${units_to_string(value2.units)}"`)
    }

    // todo check if both are TemporalValue, then return TemporalRangeValue
    // todo check if both are TemporalRangeValue and also raise error if not same range

    return {
        ...value1,
        value: value1.value - value2.value,
    }
}
