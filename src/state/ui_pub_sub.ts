import { pub_sub_factory } from "../utils/pub_sub_factory"



interface UIMsgMap
{
    ui_toggle_show_natural_gas_bubble: undefined
    ui_toggle_show_co2_bubble: undefined
    ui_toggle_show_co2_bubble__max: undefined
    ui_toggle_action_protect_trees: undefined
    ui_toggle_action_plant_trees: undefined
    ui_toggle_action_protect_peatland: undefined
    ui_toggle_action_improve_insulation: undefined
    ui_toggle_show_tree_CO2_absorbed: undefined
    ui_toggle_show_forest_area_constraint_personal_property_area: undefined
    ui_toggle_show_forest_area_constraint_existing_forest_country_area: undefined
    ui_toggle_show_forest_area_constraint_max_forestable_country_area: undefined
    ui_toggle_show_forest_area_constraint_max_forestable_city_plus_country_area: undefined
}


export type valid_ui_msg = keyof UIMsgMap


export const ui_pub_sub = pub_sub_factory<UIMsgMap>()
