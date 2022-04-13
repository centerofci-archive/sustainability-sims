import { divide } from "../../data_support/calc/divide"
import { multiply } from "../../data_support/calc/multiply"
import { subtract } from "../../data_support/calc/subtract"
import { scale_temporally } from "../../data_support/datetime/range"
import { convert_value } from "../../data_support/units/convert"
import { UnitsID } from "../../data_support/units/units"
import { TemporalRangeValue, TemporalValue, ValueObject } from "../../data_support/value"
import { value_or_raise } from "../../data_support/value_or_error"
import { DATES } from "../dates"



const home1_gas_meter: {
    _2021_09_24: TemporalValue
    _2021_11_04: TemporalValue
    _2022_01_04: TemporalValue
    _2022_03_28: TemporalValue
} =
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


const home1_monthly_gas_charge: {
    _2022_04_18: TemporalValue
    _2022_04_19: TemporalValue
} =
{
    _2022_04_18:
    {
        description: "This monthly gas charge would have come into effect much earlier, perhaps in 2021 or 2020",
        value: 94.39,
        units: { num: [UnitsID.currency_gbp], denom: [UnitsID.time_period_month] },
        date: DATES.date_2022_04_18,
    },
    _2022_04_19:
    {
        value: 163.85,
        units: { num: [UnitsID.currency_gbp], denom: [UnitsID.time_period_month] },
        date: DATES.date_2022_04_19,
    },
}


const home1_gas_GBP_cost_per_kWh: {
    _2022_04_19: TemporalValue
} =
{
    _2022_04_19:
    {
        value: 0.0734,
        units: { num: [UnitsID.currency_gbp], denom: [UnitsID.energy_kWh] },
        date: DATES.date_2022_04_19,
    },
}

const home1_gas_standing_charge_per_day: {
    _2022_04_19: TemporalValue
} =
{
    _2022_04_19:
    {
        value: 0.2722,
        units: { num: [UnitsID.currency_gbp], denom: [UnitsID.time_period_day] },
        date: DATES.date_2022_04_19,
    },
}


const home1_electricity_meter: {
    _2021_09_24: TemporalValue
    _2021_11_04: TemporalValue
    _2022_01_04: TemporalValue
    _2022_03_28: TemporalValue
} =
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

const home1_electricity_cost_per_unit: {
    _2022_04_19: TemporalValue
} =
{
    _2022_04_19:
    {
        value: 0.2924,
        units: { num: [UnitsID.currency_gbp], denom: [UnitsID.energy_kWh] },
        date: DATES.date_2022_04_19,
    },
}



const home1_electricity_standing_charge: {
    _2022_04_19: TemporalValue
} =
{
    _2022_04_19:
    {
        value: 0.3792,
        units: { num: [UnitsID.currency_gbp], denom: [UnitsID.time_period_day] },
        date: DATES.date_2022_04_19,
    },
}


// ++++++++++++

const home1_2021_Q4_gas_usage__cubic_feet__meter_readings: TemporalRangeValue = {
    ...value_or_raise(subtract(home1_gas_meter._2022_01_04, home1_gas_meter._2021_09_24)),
    description: "Based on meter readings",
    date_from: home1_gas_meter._2021_09_24.date,
    date_to: home1_gas_meter._2022_01_04.date,
}

const home1_2021_Q4_gas_usage__m3__meter_readings: TemporalRangeValue = value_or_raise(convert_value(home1_2021_Q4_gas_usage__cubic_feet__meter_readings, UnitsID.volume_normal_m3))

const home1_2021_approx_gas_usage__m3__meter_readings: TemporalRangeValue = {
    ...home1_2021_Q4_gas_usage__m3__meter_readings,
    value: home1_2021_Q4_gas_usage__m3__meter_readings.value * 3, // multiply by 3 as more gas used during Q4 (and Q1) than other times of the year
}


// ~~~~~~~~~~~~

const home1_gas_standing_charge_per_year: { _2022_04_19: TemporalValue } = {
    _2022_04_19: value_or_raise(scale_temporally(
        home1_gas_standing_charge_per_day._2022_04_19, "year"))
}

const home1_gas_bill_per_year: { _2022_04_19: TemporalValue } = {
    _2022_04_19: value_or_raise(scale_temporally(
        home1_monthly_gas_charge._2022_04_19, "year"))
}

const home1_gas_bill_indirect__only_gas_per_year: { _2021: TemporalValue } = {
    _2021: {
        ...value_or_raise(subtract(home1_gas_bill_per_year._2022_04_19, home1_gas_standing_charge_per_year._2022_04_19)),
        description: "Estimate for 2021 based on gas bill in 2022_04_19, cost of gas per kWH in 2022_04_29 and minus the standing charge in 2022_04_29.",
    }
}

const home1_2021_approx_gas_usage__kWh__gas_bill_indirect: { _2021: TemporalValue } = {
    _2021: {
        ...divide(home1_gas_bill_indirect__only_gas_per_year._2021, home1_gas_GBP_cost_per_kWh._2022_04_19),
        description: "Calculated indirectly from gas bill in 2022_04_19 minus the standing charge.",
    }
}

// ------------


export const home1_2021_approx_gas_usage__m3__perspectives: ValueObject[] = [
    home1_2021_approx_gas_usage__m3__meter_readings,
    home1_2021_approx_gas_usage__kWh__gas_bill_indirect._2021,
]
