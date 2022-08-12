import { device_info_actions } from "./device_info/actions"
import { home_actions } from "./home/actions"
import { routing_actions } from "./routing/actions"
import { user_info_actions } from "./user_info/actions"



export const ACTIONS = {
    device_info: device_info_actions,
    home: home_actions,
    routing: routing_actions,
    user_info: user_info_actions,
}
