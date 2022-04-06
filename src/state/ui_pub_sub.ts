import { pub_sub_factory } from "../utils/pub_sub_factory"



interface UIMsgMap
{
    ui_toggle_show_natural_gas_bubble: undefined
    ui_toggle_show_co2_bubble: undefined
    ui_toggle_action_plant_trees: undefined
    ui_toggle_action_protect_peatland: undefined
    ui_toggle_action_improve_insulation: undefined
}


export type valid_ui_msg = keyof UIMsgMap


export const ui_pub_sub = pub_sub_factory<UIMsgMap>()
