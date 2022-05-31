import { RoutingState, VIEWS } from "./state"



export function get_routing_starting_state (): RoutingState
{
    return {
        view: VIEWS.landing_screen,
    }
}
