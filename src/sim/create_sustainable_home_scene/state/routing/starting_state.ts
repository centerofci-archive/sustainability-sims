import { RoutingState, VIEWS } from "./state"



export function get_routing_starting_state (): RoutingState
{
    return {
        view:
            // VIEWS.__internal_generate_option_preview_images,
            // VIEWS.landing_screen,
            // VIEWS.home_selection_menu,
            VIEWS.home_home_page,
        is_current_not_future: true,
    }
}
