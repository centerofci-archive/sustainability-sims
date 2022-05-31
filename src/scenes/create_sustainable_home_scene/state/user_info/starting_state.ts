import { UserInfoState } from "./state"



export function get_user_info_starting_state (): UserInfoState
{
    return {
        detected_location: undefined,
    }
}
