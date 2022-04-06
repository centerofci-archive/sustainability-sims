import { simplify_units } from "../units/simplify_units"
import { make_units_compound, make_num_units_list, make_denom_units_list, Units } from "../units/utils"
import { ValueObject } from "../value"



export function multiply (value1: ValueObject, value2: ValueObject): ValueObject
{
    let { num, denom } = make_units_compound(value1.units)

    num = num.concat(make_num_units_list(value2.units))
    denom = denom.concat(make_denom_units_list(value2.units))

    const units: Units = simplify_units({ num, denom })

    return {
        value: value1.value * value2.value,
        units,
    }
}
