import { get_device_info_starting_state } from "./device_info/starting_state"
import { get_routing_starting_state } from "./routing/starting_state"
import { SustainableHomeRootState } from "./state"
import { get_user_info_starting_state } from "./user_info/starting_state"



export function get_sustainable_home_starting_state (load_state_from_storage: boolean): SustainableHomeRootState
{
    return {
        device_info: get_device_info_starting_state(),
        routing: get_routing_starting_state(),
        user_info: get_user_info_starting_state(),
    }
}
