import { AnyAction } from "redux"
import { sustainable_home_root_reducer } from "../sim/create_sustainable_home_scene/state/reducer";
import { AppRootState } from "./state"



export const root_reducer = (state: AppRootState, action: AnyAction): AppRootState =>
{
    let changed = false

    const sustainable_home = sustainable_home_root_reducer(state.sustainable_home, action)
    changed = sustainable_home !== state.sustainable_home

    if (changed)
    {
        state = {
            sustainable_home,
        }
    }

    // state = { ...state, last_action: action }

    ;(window as any).debug_state = state

    return state
}
