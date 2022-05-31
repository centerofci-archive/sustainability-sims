import { RoutingState } from "./routing/state"
import { UserInfoState } from "./user_info/state"



export interface RootState
{
    routing: RoutingState
    user_info: UserInfoState
}
