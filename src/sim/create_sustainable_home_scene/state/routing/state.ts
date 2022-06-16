

export type ViewTypes = (
    "landing_screen"
    | "home_selection_menu"
    | "__internal_generate_option_preview_images"
)

export const VIEWS: {[P in ViewTypes]: P} = {
    home_selection_menu: "home_selection_menu",
    landing_screen: "landing_screen",
    __internal_generate_option_preview_images: "__internal_generate_option_preview_images",
}



export interface RoutingState
{
    view: ViewTypes
}
