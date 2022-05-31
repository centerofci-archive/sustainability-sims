import type { Action, AnyAction } from "redux"
import { GeoLocation } from "./state"



interface SetDetectedUserLocationArgs
{
    detected_location: GeoLocation | undefined
}

interface ActionSetDetectedUserLocation extends Action, SetDetectedUserLocationArgs {}

const set_detected_user_location_type = "set_detected_user_location"

const set_detected_user_location = (args: SetDetectedUserLocationArgs): ActionSetDetectedUserLocation =>
{
    return { type: set_detected_user_location_type, ...args }
}

export const is_set_detected_user_location = (action: AnyAction): action is ActionSetDetectedUserLocation => {
    return action.type === set_detected_user_location_type
}



export const user_info_actions = {
    set_detected_user_location,
}
