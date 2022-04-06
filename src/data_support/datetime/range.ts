import { TemporalRangeValue } from "../value"
import { ValueOrError } from "../value_or_error"
import { days_range, subtract_days_from_date } from "./subtract"



const DAYS_IN_YEAR = 365.25
const DAYS_IN_QUARTER = DAYS_IN_YEAR / 4
const DAYS_IN_MONTH = DAYS_IN_YEAR / 12

export function time_period_to_days (time_period: string): ValueOrError<number>
{
    time_period = time_period.toLowerCase()

    let value = undefined
    let error = ""

    if (time_period === "annually") value = Math.round(DAYS_IN_YEAR)
    else if (time_period === "quarterly") value = Math.round(DAYS_IN_QUARTER)
    else if (time_period === "monthly") value = Math.round(DAYS_IN_MONTH)
    else if (time_period === "daily") value = 1
    else
    {
        error = `Unsupported time period: "${time_period}"`
    }

    return { value, error }
}



function approximately_a_month (value_object: TemporalRangeValue)
{
    const days = days_range(value_object)
    return days >= 28 && days <= 31
}


export function scale_to_approximately_a_month (value_object: TemporalRangeValue): TemporalRangeValue
{
    if (approximately_a_month(value_object)) return value_object

    const days = days_range(value_object)
    const ratio = DAYS_IN_MONTH / days

    const date_from = subtract_days_from_date(value_object.date_to, Math.round(DAYS_IN_MONTH))
    const value = value_object.value * ratio

    return {
        ...value_object,
        date_from,
        value,
    }
}
