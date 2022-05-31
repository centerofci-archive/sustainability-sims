import { AnyAction } from "redux"
import { update_substate } from "../../../../utils/update_state"

import { RootState } from "../state"
import { is_set_detected_user_location } from "./actions"



export const user_info_reducer = (state: RootState, action: AnyAction): RootState =>
{

    if (is_set_detected_user_location(action))
    {
        state = update_substate(state, "user", "detected_location", action.detected_location)
    }

    return state
}
