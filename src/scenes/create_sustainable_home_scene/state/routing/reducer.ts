import { AnyAction } from "redux"

import { RootState } from "../state"



export const routing_reducer = (state: RootState, action: AnyAction): RootState =>
{

    // if (is_set_detected_user_location(action))
    // {
    //     state = update_substate(state, "user", "detected_location", action.detected_location)
    // }

    return state
}
