import { units_are_equal, units_to_string } from "../units/utils"
import { ValueObject } from "../value"
import { ValueOrError } from "../value_or_error"



export function subtract <T extends ValueObject, T2 extends ValueObject> (value1: T, value2: T2): ValueOrError<T>
{
    if (!units_are_equal(value1.units, value2.units))
    {
        const error = `Units are not equal.  Can not subtract: "${units_to_string(value1.units)}" and "${units_to_string(value2.units)}"`

        return { value: undefined, error }
    }

    // todo check if both are TemporalValue, then return TemporalRangeValue
    // todo check if both are TemporalRangeValue and also raise error if not same range

    const new_value_object: T = {
        ...value1,
        value: value1.value - value2.value,
    }

    return { value: new_value_object, error: "" }
}
