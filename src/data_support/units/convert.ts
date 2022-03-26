import { Value } from "../value"
import { UnitsID, UNITS } from "./units"
import { units_are_compound, units_are_singular } from "./utils"


type UnitConversionMapEntry = { [id in UnitsID]: number }
type UnitConversionMap = { [id in UnitsID]?: UnitConversionMapEntry }
export const unit_conversion_map: UnitConversionMap = {
    [UNITS.energy_therm.id]: {
        [UNITS.energy_joule.id]: 105506000, // source: https://en.wikipedia.org/wiki/Therm#Definitions
        [UNITS.volume_normal_m3.id]: 2.851, // source: https://www.convert-me.com/en/convert/energy/therm/therm-to-cmsgas.html?u=therm&v=1
    },
    [UNITS.volume_normal_cubic_feet.id]: {
        [UNITS.volume_normal_m3.id]: 0.02832, // source: https://www.convert-me.com/en/convert/volume/ft3.html?u=ft3&v=1
    },
}



export function convert_value <T extends Value> (value: T, new_units: UnitsID): T
{
    const { units } = value
    if (units_are_compound(units))
    {
        throw new Error(`Can not yet convert compound units: "${JSON.stringify(units)}"`)
    }


    let map: UnitConversionMapEntry | undefined = undefined
    if (units_are_singular(units))
    {
        map = unit_conversion_map[units]
    }

    if (!map)
    {
        throw new Error(`No conversion map for units: "${units}"`)
    }

    const factor = map[new_units]
    if (factor === undefined)
    {
        debugger
        throw new Error(`No conversion factor from: "${units}" to "${new_units}"`)
    }


    return {
        ...value,
        value: value.value * factor,
        units: new_units,
    }
}
