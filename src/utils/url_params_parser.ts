


export interface URLParams
{
    [key: string]: string
}

export function url_params_parser ()
{
    const search = document.location.search.slice(1)
    const parts = search.split("&")

    const map: URLParams = {}
    parts.forEach(part =>
    {
        const pair = part.split("=")
        const key = decodeURIComponent(pair[0])
        const value = decodeURIComponent(pair[1])
        map[key] = value
    })

    return map
}



export function get_url_param_number (url_params: URLParams, key: string, default_value = 0)
{
    const value_str = url_params[key] ?? `${default_value}`

    let value = default_value
    let error = ""
    try
    {
        value = parseFloat(value_str)
    }
    catch (e)
    {
        error = `Not a valid number: "${value_str}"`
    }

    return { value, error }
}



export function get_url_param (url_params: URLParams, key: string, default_value = "")
{
    return url_params[key] ?? default_value
}
