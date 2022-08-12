import { HomeState } from "./state"



export function get_home_starting_state (): HomeState
{
    return {
        selected_default_home_type: "",
    }
}
