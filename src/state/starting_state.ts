import { AppRootState } from "./state"
import { get_sustainable_home_starting_state } from "../sim/create_sustainable_home_scene/state/starting_state"



export function get_starting_state (load_state_from_storage: boolean): AppRootState
{
    return {
        sustainable_home: get_sustainable_home_starting_state(load_state_from_storage),
    }
}
