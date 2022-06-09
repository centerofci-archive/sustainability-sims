import { AnyAction } from "redux"
import { device_info_reducer } from "./device_info/reducer"
import { routing_reducer } from "./routing/reducer"

import { SustainableHomeRootState } from "./state"
import { user_info_reducer } from "./user_info/reducer"



export const sustainable_home_root_reducer = (state: SustainableHomeRootState, action: AnyAction): SustainableHomeRootState =>
{
    // const initial_state = state

    state = device_info_reducer(state, action)
    state = routing_reducer(state, action)
    state = user_info_reducer(state, action)

    // state = { ...state, last_action: action }

    return state
}
