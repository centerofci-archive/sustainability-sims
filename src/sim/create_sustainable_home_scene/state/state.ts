import { DeviceInfoState } from "./device_info/state"
import { RoutingState } from "./routing/state"
import { UserInfoState } from "./user_info/state"



export interface SustainableHomeRootState
{
    device_info: DeviceInfoState
    routing: RoutingState
    user_info: UserInfoState
}
