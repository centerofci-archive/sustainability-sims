


export enum UnitsID
{
    // undefined
    undefined = "undefined",

    // dimensionless
    ratio = "ratio",
    percentage = "percentage",

    // time
    time_period_year = "time_period_year",
    time_period_quarter = "time_period_quarter",
    time_period_month = "time_period_month",
    time_period_day = "time_period_day",
    time_period_second = "time_period_second",

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
    undefined:
    {
        id: UnitsID.undefined,
        name: "undefined",
        symbol: "?",
    },

    ratio:
    {
        id: UnitsID.ratio,
        name: "ratio",
        symbol: "",
    },

    percentage:
    {
        id: UnitsID.percentage,
        name: "percentage",
        symbol: "%",
    },

    time_period_year:
    {
        id: UnitsID.time_period_year,
        name: "year",
        symbol: "year",
    },
    time_period_quarter:
    {
        id: UnitsID.time_period_quarter,
        name: "quarter",
        symbol: "quarter",
    },
    time_period_month:
    {
        id: UnitsID.time_period_month,
        name: "month",
        symbol: "month",
    },
    time_period_day:
    {
        id: UnitsID.time_period_day,
        name: "day",
        symbol: "day",
    },
    time_period_second:
    {
        id: UnitsID.time_period_second,
        name: "second",
        symbol: "s",
    },

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



// Needs an object of strings instead of enum as these strings will be parsed from url params
export const TIME_PERIODS =
{
    year: UNITS.time_period_year.symbol,
    quarter: UNITS.time_period_quarter.symbol,
    month: UNITS.time_period_month.symbol,
    day: UNITS.time_period_day.symbol,
}
export const VALID_TIME_PERIODS_VALUES = new Set(Object.values(TIME_PERIODS))

const _type_check_TIME_PERIODS: {[id: string]: string } = TIME_PERIODS



export const VOLUME_UNITS =
{
    m3: UNITS.volume_normal_m3.symbol,
    ft3: UNITS.volume_normal_cubic_feet.symbol,
}

const _type_check_VOLUME_UNITS: {[id: string]: string } = VOLUME_UNITS
