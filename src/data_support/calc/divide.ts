import { simplify_units } from "../units/simplify_units"
import { make_denom_units_list, make_num_units_list, make_units_compound, Units } from "../units/utils"
import { Value } from "../value"



export function divide (value1: Value, value2: Value): Value
{
    let { num, denom } = make_units_compound(value1.units)

    num = num.concat(make_denom_units_list(value2.units))
    denom = denom.concat(make_num_units_list(value2.units))

    const units: Units = simplify_units({ num, denom })

    return {
        value: value1.value / value2.value,
        units,
    }
}
