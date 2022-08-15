import { AnyAction } from "redux"
import { update_substate } from "../../../../utils/update_state"

import { SustainableHomeRootState } from "../state"
import { is_change_current_future, is_change_view } from "./actions"



export const routing_reducer = (state: SustainableHomeRootState, action: AnyAction): SustainableHomeRootState =>
{

    if (is_change_view(action))
    {
        state = update_substate(state, "routing", "view", action.view)
    }


    if (is_change_current_future(action))
    {
        state = update_substate(state, "routing", "is_current_not_future", action.is_current)
    }


    return state
}
