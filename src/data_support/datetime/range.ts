import { multiply } from "../calc/multiply"
import { simplify_units } from "../units/simplify_units"
import { TIME_PERIODS, UnitsID, VALID_TIME_PERIODS_VALUES } from "../units/units"
import { units_are_singular } from "../units/utils"
import { TemporalRangeValue, ValueObject } from "../value"
import { ValueOrError } from "../value_or_error"
import { days_range, subtract_days_from_date } from "./subtract"



const DAYS_IN_YEAR = 365.25
const DAYS_IN_QUARTER = DAYS_IN_YEAR / 4
const DAYS_IN_MONTH = DAYS_IN_YEAR / 12
const SECONDS_IN_DAY = 24 * 3600
const SECONDS_IN_MONTH = SECONDS_IN_DAY * DAYS_IN_MONTH
const SECONDS_IN_YEAR = SECONDS_IN_DAY * DAYS_IN_YEAR



export function sanitise_time_period (time_period: ValueOrError<string>): ValueOrError<string>
{
    if (time_period.error) return time_period

    let { value = "", error } = time_period

    if (VALID_TIME_PERIODS_VALUES.has(value)) return time_period

    if (value === "annually") value = TIME_PERIODS.year
    else if (value === "quarterly") value = TIME_PERIODS.quarter
    else if (value === "monthly") value = TIME_PERIODS.month
    else if (value === "daily") value = TIME_PERIODS.day
    else
    {
        value = ""
        error = `Unsupported time period "${value}"`
    }

    return { value, error }
}



export function time_period_to_days (time_period: string): ValueOrError<number>
{
    time_period = time_period.toLowerCase()

    let value = undefined
    let error = ""

    if (time_period === TIME_PERIODS.year) value = Math.round(DAYS_IN_YEAR)
    else if (time_period === TIME_PERIODS.quarter) value = Math.round(DAYS_IN_QUARTER)
    else if (time_period === TIME_PERIODS.month) value = Math.round(DAYS_IN_MONTH)
    else if (time_period === TIME_PERIODS.day) value = 1
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



function approximately_a_year (value_object: TemporalRangeValue)
{
    const days = days_range(value_object)
    return days >= 365 && days <= 366
}


export function scale_to_approximately_a_year (value_object: TemporalRangeValue): TemporalRangeValue
{
    if (approximately_a_year(value_object)) return value_object

    const days = days_range(value_object)
    const ratio = DAYS_IN_YEAR / days

    const date_from = subtract_days_from_date(value_object.date_to, Math.round(DAYS_IN_YEAR))
    const value = value_object.value * ratio

    return {
        ...value_object,
        date_from,
        value,
    }
}



export function scale_temporally <V extends ValueObject> (value_object: V, scale_to: "year" | "month"): ValueOrError<V>
{
    const units = simplify_units(value_object.units)

    if (units_are_singular(units))
    {
        return { value: undefined, error: `Must have units with time in denominator but got: "${JSON.stringify(units)}"` }
    }

    const num_time_units = units.num.filter(u => u.toString().startsWith("time_period_"))
    const denom_time_units = units.denom.filter(u => u.toString().startsWith("time_period_"))

    if (num_time_units.length)
    {
        return { value: undefined, error: `Not implemented supporting time units in numerator.  Have units: "${JSON.stringify(units)}"` }
    }

    if (denom_time_units.length !== 1)
    {
        return { value: undefined, error: `Not implemented supporting multiple time units in denominator.  Have units: "${JSON.stringify(units)}"` }
    }

    const denom_time_unit = denom_time_units[0]

    let seconds = 0
    if (denom_time_unit === UnitsID.time_period_day) seconds = SECONDS_IN_DAY
    else if (denom_time_unit === UnitsID.time_period_month) seconds = SECONDS_IN_MONTH
    else if (denom_time_unit === UnitsID.time_period_year) seconds = SECONDS_IN_YEAR

    if (seconds === 0)
    {
        return { value: undefined, error: `Not implemented supporting time units in demoninator of: "${denom_time_unit}"` }
    }


    let scale_value = 1
    let scale_units_denom: UnitsID[] = []
    if (scale_to === "month")
    {
        scale_value = SECONDS_IN_MONTH / seconds
        scale_units_denom = [UnitsID.time_period_month]
    }
    else if (scale_to === "year")
    {
        scale_value = SECONDS_IN_MONTH / seconds
        scale_units_denom = [UnitsID.time_period_year]
    }

    const scale: ValueObject = {
        value: scale_value,
        units: {
            num: [denom_time_unit],
            denom: scale_units_denom,
        }
    }

    const scaled_value_object: V = multiply<V, ValueObject>(value_object, scale)


    return { value: scaled_value_object, error: "" }
}
