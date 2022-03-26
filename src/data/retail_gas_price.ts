import { UnitsID } from "../data_support/units/units"
import { TemporalRangeValue } from "../data_support/value"
import { DATES } from "./dates"



const average_uk_gas_price_2019: TemporalRangeValue = {
    // source: https://pod.inrupt.com/ajp/public/2022-03-25_tradingeconomics.com_uk_natural_gas__2019.png
    // original page: https://tradingeconomics.com/commodity/uk-natural-gas
    // access date: 2022-03-25
    // Average value estimated by eye
    value: 39.4,
    units: { num: [UnitsID.currency_gbp], denom: [UnitsID.energy_therm] },
    date_from: DATES.date_2019_01_01,
    date_to: DATES.date_2020_01_01,
}

const average_uk_gas_price_2020: TemporalRangeValue = {
    // source: https://pod.inrupt.com/ajp/public/2022-03-25_tradingeconomics.com_uk_natural_gas__2020.png
    // original page: https://tradingeconomics.com/commodity/uk-natural-gas
    // access date: 2022-03-25
    // Average value estimated by eye
    value: 24.7,
    units: { num: [UnitsID.currency_gbp], denom: [UnitsID.energy_therm] },
    date_from: DATES.date_2020_01_01,
    date_to: DATES.date_2021_01_01,
}

const average_uk_gas_price_2021: TemporalRangeValue = {
    // source: https://pod.inrupt.com/ajp/public/2022-03-25_tradingeconomics.com_uk_natural_gas__2021.png
    // original page: https://tradingeconomics.com/commodity/uk-natural-gas
    // access date: 2022-03-25
    // Average value estimated by eye
    value: 115,
    units: { num: [UnitsID.currency_gbp], denom: [UnitsID.energy_therm] },
    date_from: DATES.date_2021_01_01,
    date_to: DATES.date_2022_01_01,
}


export const gas_price = {
    average_annual: {
        uk: {
            average_uk_gas_price_2019,
            average_uk_gas_price_2020,
            average_uk_gas_price_2021,
        }
    }
}
