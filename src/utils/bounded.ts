


export function bounded (num: number, min: number, max: number)
{
    return Math.max(Math.min(num, max), min)
}
