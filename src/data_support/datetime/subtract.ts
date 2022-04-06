import { TemporalRangeValue } from "../value"



const DAY_IN_MS = 24 * 3600 * 1000

export function subtract_days_from_date (date: Date, days: number)
{
    return new Date(date.getTime() - (days * DAY_IN_MS))
}



export function subtract_dates (date1: Date, date2: Date)
{
    return date1.getTime() - date2.getTime()
}



export function days_range (value_object: TemporalRangeValue)
{
    return (value_object.date_to.getTime() - value_object.date_from.getTime()) / DAY_IN_MS
}
