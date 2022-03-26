import { UnitsID } from "./units"
import { Units, units_are_singular, units_are_compound } from "./utils"



export function simplify_units (units: Units): Units
{
    if (units_are_singular(units)) return units

    let { num, denom } = units

    const units_count: {[id in UnitsID]?: number} = {}
    num.forEach(entry => units_count[entry] = (units_count[entry] || 0) + 1)

    const remove_units_count: {[id: string]: number} = {}
    denom.forEach(entry =>
    {
        const count = (units_count[entry] || 0) - (remove_units_count[entry] || 0)

        if (count <= 0) return // count should never be < 0 but we're defensive here

        remove_units_count[entry] = (remove_units_count[entry] || 0) + 1
    })


    Object.entries(remove_units_count).forEach(([id, count]) =>
    {
        let removed_from_num = 0
        num = num.filter(entry =>
        {
            if ((entry as unknown) !== id) return true

            if (removed_from_num >= count) return true
            ++removed_from_num
            return false
        })

        let removed_from_denom = 0
        denom = denom.filter(entry =>
        {
            if ((entry as unknown) !== id) return true

            if (removed_from_denom >= count) return true
            ++removed_from_denom
            return false
        })
    })


    if (denom.length === 0 && num.length === 1) return num[0]


    return { num, denom }
}



function run_tests ()
{
    const result = simplify_units({
        num: [UnitsID.energy_joule, UnitsID.energy_joule],
        denom: [UnitsID.energy_joule, UnitsID.energy_joule, UnitsID.energy_joule]
    })

    console.assert(units_are_compound(result) && result.num.length === 0)
    console.assert(units_are_compound(result) && result.denom.length === 1)
    console.assert(units_are_compound(result) && result.denom[0] === UnitsID.energy_joule)
}

// run_tests()
