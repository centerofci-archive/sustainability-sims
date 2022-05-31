import { AnyAction } from "redux"
import { routing_reducer } from "./routing/reducer"

import { RootState } from "./state"
import { user_info_reducer } from "./user_info/reducer"



export const root_reducer = (state: RootState, action: AnyAction): RootState =>
{
    // const initial_state = state

    state = routing_reducer(state, action)
    state = user_info_reducer(state, action)

    // state = { ...state, last_action: action }

    ;(window as any).debug_state = state

    return state
}
