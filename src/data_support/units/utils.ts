import { UnitsID } from "./units"



interface CompoundUnits
{
    num: UnitsID[]
    denom: UnitsID[]
}
export type Units = UnitsID | CompoundUnits

export function units_are_singular (units: Units): units is UnitsID
{
    return typeof units === "string"
}
export function units_are_compound (units: Units): units is CompoundUnits
{
    return typeof units !== "string"
}




export function units_to_string (units: Units)
{
    if (units_are_singular(units)) return units
    return `${units.num.join(" ")} / ${units.denom.join(" ")}`
}



export function make_num_units_list (units: Units): UnitsID[]
{
    return units_are_singular(units) ? [units] : [...units.num]
}
export function make_denom_units_list (units: Units): UnitsID[]
{
    return units_are_singular(units) ? [] : [...units.denom]
}

export function make_units_compound (units: Units): CompoundUnits
{
    return {
        num: make_num_units_list(units),
        denom: make_denom_units_list(units),
    }
}



export function units_are_equal (units1: Units, units2: Units)
{
    if (units_are_singular(units1))
    {
        if (!units_are_singular(units2)) return false

        return units1 === units2
    }

    if (units_are_singular(units2)) return false

    return lists_contain_same_elements_count(units1.num, units2.num)
        && lists_contain_same_elements_count(units1.denom, units2.denom)
}



function lists_contain_same_elements_count <T extends string> (a: T[], b: T[])
{
    if (a.length !== b.length) return false


    const count_a: {[id: string]: number} = {}
    a.forEach(entry => count_a[entry] = (count_a[entry] || 0) + 1)

    const count_b: {[id: string]: number} = {}
    b.forEach(entry => count_b[entry] = (count_b[entry] || 0) + 1)


    const mismatch = Object.entries(count_a).find(([units, count]) => count_b[units] !== count)

    return !mismatch
}
