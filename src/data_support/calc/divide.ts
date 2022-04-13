import { simplify_units } from "../units/simplify_units"
import { make_denom_units_list, make_num_units_list, make_units_compound, Units } from "../units/utils"
import { ValueObject } from "../value"



export function divide <T extends ValueObject, T2 extends ValueObject> (value1: T, value2: T2): T
{
    let { num, denom } = make_units_compound(value1.units)

    num = num.concat(make_denom_units_list(value2.units))
    denom = denom.concat(make_num_units_list(value2.units))

    const units: Units = simplify_units({ num, denom })

    return {
        ...value1,
        description: (value1.description || "") + " / " + (value2.description || ""),
        value: value1.value / value2.value,
        units,
    }
}
