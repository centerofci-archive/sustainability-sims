

type ViewTypes = (
    "landing_screen"
    | "home_selection_menu"
)

export const VIEWS: {[P in ViewTypes]: P} = {
    home_selection_menu: "home_selection_menu",
    landing_screen: "landing_screen",
}



export interface RoutingState
{
    view: ViewTypes
}
