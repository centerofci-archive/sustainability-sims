import { divide } from "../../data_support/calc/divide"
import { convert_value } from "../../data_support/units/convert"
import { UnitsID } from "../../data_support/units/units"
import { get_latest_value, TemporalRangeValue } from "../../data_support/value"
import { DATES } from "../dates"
import { gas_price } from "../retail_gas_price"



export const home2_annual_gas_bill_2019: TemporalRangeValue = {
    description: "Based off memory and estimate for heating, hot water and cooking",
    value: 800,
    units: UnitsID.currency_gbp,
    date_from: DATES.date_2019_01_01,
    date_to: DATES.date_2020_01_01,
}


export const home2_gas_bill_2022_feb__gbp: TemporalRangeValue = {
    description: "Based on bill which shows the actual cost of gas (this includes other charges like the Standing Charge of 24.879p/day and VAT at 5%)",
    value: 186.49,
    units: UnitsID.currency_gbp,
    date_from: DATES.date_2022_02_14,
    date_to: DATES.date_2022_03_14,
}


export const home2_gas_usage_2022_feb__m3: TemporalRangeValue = {
    value: 386,
    units: UnitsID.volume_normal_m3,
    date_from: DATES.date_2022_02_14,
    date_to: DATES.date_2022_03_14,
}



export const home2_annual_2019_gas_usage__therm: TemporalRangeValue = {
    ...home2_annual_gas_bill_2019,
    ...divide(home2_annual_gas_bill_2019, get_latest_value(gas_price.average_annual.uk.average_uk_gas_price_2019)),
    description: "Estimate based off 2019 estimate of gas bill",
}


export const home2_annual_2019_gas_usage__m3: TemporalRangeValue = {
    ...home2_annual_2019_gas_usage__therm,
    ...convert_value(home2_annual_2019_gas_usage__therm, UnitsID.volume_normal_m3),
    description: "Estimate based off 2019 estimate of estimated gas bill with calculation of therms given average uk gas price",
}

export const home2_annual_2022_gas_usage__m3: TemporalRangeValue = {
    ...home2_gas_usage_2022_feb__m3,
    value: home2_gas_usage_2022_feb__m3.value * 12,
    description: "Estimate based off multiplying winter usage by 12.  Which hopefully will give an upper bound.  Will hopefully be more accurate than 2019 gas usage from estimated bill and uk gas prices.",
}


export const home2_annual_gas_usage__m3 = {
    first_estimate_for_2019: home2_annual_2019_gas_usage__m3,
    second_estimate_for_2022: home2_annual_2019_gas_usage__m3,
}
