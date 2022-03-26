import { Units } from "./units/utils"


// export interface Source
// {
//     url: string
//     access_date: Date
// }


export interface Value
{
    value: number
    units: Units
    // title?: string
    description?: string
    // sources?: Source[]
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


export function get_latest_value <T extends Value> (value: T | [T, ...Partial<T>[]]): T
{
    if (!(value instanceof Array)) return value

    return get_value(value, value.length - 1)
}


export function get_value <T extends Value> (value: T | [T, ...Partial<T>[]], version: number): T
{
    if (!(value instanceof Array)) return value

    return compose_to_version_n(value, version)
}



function compose_to_version_n <T extends Value> (value: [T, ...Partial<T>[]], version: number): T
{
    if (version >= value.length)
    {
        const str = (
            `Attempting to get composed value from version "${version}", ` +
            `but only "${value.length}" versions available.`
        )
        console.error(str)
    }

    let current_version = 0
    let composed_value: T = value[0]
    while (current_version < version)
    {
        ++current_version
        composed_value = { ...composed_value, ...value[current_version] }
    }

    return composed_value
}
