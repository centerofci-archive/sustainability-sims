import { AnyAction } from "redux"
import { update_substate } from "../../../../utils/update_state"

import { SustainableHomeRootState } from "../state"
import { is_select_default_home_type } from "./actions"



export const home_reducer = (state: SustainableHomeRootState, action: AnyAction): SustainableHomeRootState =>
{

    if (is_select_default_home_type(action))
    {
        state = update_substate(state, "home", "selected_default_home_type", action.home_type)
    }

    return state
}
