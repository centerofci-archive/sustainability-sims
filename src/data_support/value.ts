import { Units } from "./units/units"


export interface Value
{
    value: number
    units: Units
}


export interface TemporalValue extends Value
{
    date: Date
}

export interface TemporalRangeValue extends Value
{
    date_from: Date
    date_to: Date
}


// export function value_to_UI_string (value: Value)
// {

// }
