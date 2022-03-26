import { divide } from "../../data_support/calc/divide"
import { convert_value } from "../../data_support/units/convert"
import { UnitsID } from "../../data_support/units/units"
import { get_latest_value, TemporalRangeValue } from "../../data_support/value"
import { DATES } from "../dates"
import { gas_price } from "../retail_gas_price"



export const home2_annual_gas_bill: TemporalRangeValue = {
    value: 800,
    units: UnitsID.currency_gbp,
    date_from: DATES.date_2019_01_01,
    date_to: DATES.date_2020_01_01,
}


export const home2_annual_2019_gas_usage__therm: TemporalRangeValue = {
    // todo get the bill which shows the actual price and volume of gas
    ...divide(home2_annual_gas_bill, get_latest_value(gas_price.average_annual.uk.average_uk_gas_price_2019)),
    date_from: DATES.date_2019_01_01,
    date_to: DATES.date_2020_01_01,
}


export const home2_annual_2019_gas_usage__m3: TemporalRangeValue = {
    ...convert_value(home2_annual_2019_gas_usage__therm, UnitsID.volume_normal_m3),
    date_from: DATES.date_2019_01_01,
    date_to: DATES.date_2020_01_01,
}
