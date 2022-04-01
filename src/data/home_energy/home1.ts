import { subtract } from "../../data_support/calc/subtract"
import { convert_value } from "../../data_support/units/convert"
import { UnitsID } from "../../data_support/units/units"
import { TemporalRangeValue, TemporalValue } from "../../data_support/value"
import { DATES } from "../dates"



const home1_gas_meter: {[date: string]: TemporalValue} =
{
    _2021_09_24:
    {
        value: 38827,
        units: UnitsID.volume_normal_cubic_feet,
        date: DATES.date_2021_09_24,
    },
    _2021_11_04:
    {
        value: 39245,
        units: UnitsID.volume_normal_cubic_feet,
        date: DATES.date_2021_11_04,
    },
    _2022_01_04:
    {
        value: 40311,
        units: UnitsID.volume_normal_cubic_feet,
        date: DATES.date_2022_01_04,
    },
    _2022_03_28:
    {
        value: 41474,
        units: UnitsID.volume_normal_cubic_feet,
        date: DATES.date_2022_03_28,
    },
}

const home1_electricity_meter: {[date: string]: TemporalValue} =
{
    _2021_09_24:
    {
        value: 44917.29,
        units: UnitsID.energy_kWh,
        date: DATES.date_2021_09_24,
    },
    _2021_11_04:
    {
        value: 45121.13,
        units: UnitsID.energy_kWh,
        date: DATES.date_2021_11_04,
    },
    _2022_01_04:
    {
        value: 45422.56,
        units: UnitsID.energy_kWh,
        date: DATES.date_2022_01_04,
    },
    _2022_03_28:
    {
        value: 45738.80,
        units: UnitsID.energy_kWh,
        date: DATES.date_2022_03_28,
    },
}



export const home1_2021_Q4_gas_usage__cubic_feet: TemporalRangeValue = {
    ...subtract(home1_gas_meter._2022_01_04, home1_gas_meter._2021_09_24),
    date_from: home1_gas_meter._2021_09_24.date,
    date_to: home1_gas_meter._2022_01_04.date,
}

export const home1_2021_Q4_gas_usage__m3: TemporalRangeValue = {
    ...convert_value(home1_2021_Q4_gas_usage__cubic_feet, UnitsID.volume_normal_m3),
}

export const home1_2021_approx_gas_usage__m3: TemporalRangeValue = {
    ...home1_2021_Q4_gas_usage__m3,
    value: home1_2021_Q4_gas_usage__m3.value * 3, // multiply by 3 as more gas used during Q4 (and Q1) than other times of the year
}
