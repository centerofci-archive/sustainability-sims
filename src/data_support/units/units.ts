


export enum UnitsID
{
    // energy
    energy_joule = "energy_joule",
    energy_kWh = "energy_kWh",
    energy_therm = "energy_therm",
    energy_BTU = "energy_BTU",

    // volume
    volume_normal_m3 = "volume_normal_m3",
    volume_normal_cubic_feet = "volume_normal_cubic_feet",

    // currency
    currency_gbp = "currency_gbp",
}


const error1 = Object.entries(UnitsID).filter(([key, value]) => key !== value)
if (error1.length) throw new Error(`Mismatching UnitsID keys and values: ${error1.map(([key]) => key).join(",")}`)



interface Unit
{
    id: UnitsID
    name: string
    symbol: string
}


type UnitsMap = {[P in UnitsID]: Unit }
export const UNITS: UnitsMap =
{
    energy_joule:
    {
        id: UnitsID.energy_joule,
        name: "joule",
        symbol: "J",
    },
    energy_kWh:
    {
        id: UnitsID.energy_kWh,
        name: "kilowatt-hour",
        symbol: "kWh",
    },
    energy_therm:
    {
        id: UnitsID.energy_therm,
        name: "therm",
        symbol: "thm",
    },
    energy_BTU:
    {
        id: UnitsID.energy_BTU,
        name: "British Thermal Unit",
        symbol: "BTU",
    },


    volume_normal_m3:
    {
        id: UnitsID.volume_normal_m3,
        name: "cubic meter",
        symbol: "m3",
    },
    volume_normal_cubic_feet:
    {
        id: UnitsID.volume_normal_cubic_feet,
        name: "cubic feet",
        symbol: "ft3",
    },


    currency_gbp:
    {
        id: UnitsID.currency_gbp,
        name: "Pound Stirling",
        symbol: "£",
    },
}


const error2 = Object.entries(UNITS).filter(([key, value]) => key !== value.id)
if (error2.length) throw new Error(`Mismatching UNITS keys and values: ${error2.map(([key]) => key).join(",")}`)
