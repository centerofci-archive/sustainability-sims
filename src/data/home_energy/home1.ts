import { subtract } from "../../data_support/calc/subtract"
import { convert_value } from "../../data_support/units/convert"
import { UnitsID } from "../../data_support/units/units"
import { TemporalRangeValue, TemporalValue } from "../../data_support/value"
import { DATES } from "../dates"



export const home1_gas_meter_2021_09_24: TemporalValue = {
    value: 38827,
    units: UnitsID.volume_normal_cubic_feet,
    date: DATES.date_2021_09_24,
}
export const home1_electricity_meter_2021_09_24: TemporalValue = {
    value: 44917.29,
    units: UnitsID.energy_kWh,
    date: DATES.date_2021_09_24,
}
export const home1_gas_meter_2021_11_04: TemporalValue = {
    value: 39245,
    units: UnitsID.volume_normal_cubic_feet,
    date: DATES.date_2021_11_04,
}
export const home1_electricity_meter_2021_11_04: TemporalValue = {
    value: 45121.13,
    units: UnitsID.energy_kWh,
    date: DATES.date_2021_11_04,
}
export const home1_gas_meter_2022_01_04: TemporalValue = {
    value: 40311,
    units: UnitsID.volume_normal_cubic_feet,
    date: DATES.date_2022_01_04,
}
export const home1_electricity_meter_2022_01_04: TemporalValue = {
    value: 45422.56,
    units: UnitsID.energy_kWh,
    date: DATES.date_2022_01_04,
}


export const home1_2021_Q4_gas_usage__cubic_feet: TemporalRangeValue = {
    ...subtract(home1_gas_meter_2022_01_04, home1_gas_meter_2021_09_24),
    date_from: home1_gas_meter_2021_09_24.date,
    date_to: home1_gas_meter_2022_01_04.date,
}

export const home1_2021_Q4_gas_usage__m3: TemporalRangeValue = {
    ...convert_value(home1_2021_Q4_gas_usage__cubic_feet, UnitsID.volume_normal_m3),
}

export const home1_2021_approx_gas_usage__m3: TemporalRangeValue = {
    ...home1_2021_Q4_gas_usage__m3,
    value: home1_2021_Q4_gas_usage__m3.value * 3, // multiply by 3 as more gas used during Q4 (and Q1) than other times of the year
}
