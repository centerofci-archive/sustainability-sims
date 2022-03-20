


const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
}



function success_factory (resolve: (coords: GeolocationCoordinates) => void)
{
    return (position: GeolocationPosition) =>
    {
        const { coords } = position

        // console.log("Your current position is:")
        // console.log(`Latitude : ${coords.latitude}`)
        // console.log(`Longitude: ${coords.longitude}`)
        // console.log(`More or less ${coords.accuracy} meters.`)

        resolve(coords)
    }
}



function error_factory (reject: (error: GeolocationPositionError) => void)
{
    return (err: GeolocationPositionError) =>
    {
        console.warn(`ERROR(${err.code}): ${err.message}`)
        reject(err)
    }
}



export function get_location ()
{
    return new Promise<GeolocationCoordinates>((resolve, reject) =>
    {
        navigator.geolocation.getCurrentPosition(success_factory(resolve), error_factory(reject), options)
    })
}
