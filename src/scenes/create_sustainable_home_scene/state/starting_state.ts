import { RootState } from "./state";



export function get_starting_state (load_state_from_storage: boolean): RootState
{
    return { user: { detected_location: undefined } }
}
