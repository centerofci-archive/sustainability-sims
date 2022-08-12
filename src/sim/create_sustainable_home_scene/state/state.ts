import { DeviceInfoState } from "./device_info/state"
import { HomeState } from "./home/state"
import { RoutingState } from "./routing/state"
import { UserInfoState } from "./user_info/state"



export interface SustainableHomeRootState
{
    device_info: DeviceInfoState
    home: HomeState
    routing: RoutingState
    user_info: UserInfoState
}
