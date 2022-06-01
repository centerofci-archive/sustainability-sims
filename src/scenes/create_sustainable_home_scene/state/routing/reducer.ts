import { AnyAction } from "redux"
import { update_substate } from "../../../../utils/update_state"

import { RootState } from "../state"
import { is_change_view } from "./actions"



export const routing_reducer = (state: RootState, action: AnyAction): RootState =>
{

    if (is_change_view(action))
    {
        state = update_substate(state, "routing", "view", action.view)
    }

    return state
}
