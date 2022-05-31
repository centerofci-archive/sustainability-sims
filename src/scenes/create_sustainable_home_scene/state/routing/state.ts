

type ViewTypes = "home_selection_menu"

export const VIEWS: {[P in ViewTypes]: P} = {
    home_selection_menu: "home_selection_menu"
}



export interface RoutingState
{
    view: ViewTypes
}
