import { AnyAction } from "redux"
import { update_substate } from "../../../../utils/update_state"

import { SustainableHomeRootState } from "../state"
import { is_set_detected_user_location } from "./actions"



export const user_info_reducer = (state: SustainableHomeRootState, action: AnyAction): SustainableHomeRootState =>
{

    if (is_set_detected_user_location(action))
    {
        state = update_substate(state, "user", "detected_location", action.detected_location)
    }

    return state
}
