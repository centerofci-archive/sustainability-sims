


export interface ValueOrError <V>
{
    value: V | undefined
    error: string
}



export function value_or_raise <V> (value: ValueOrError<V>): V
{
    if (value.value === undefined)
    {
        throw new Error(value.error || "No error specified")
    }

    return value.value
}
