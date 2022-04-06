import { pub_sub_factory } from "../utils/pub_sub_factory"



interface UIMsgMap
{
    ui_toggle_show_natural_gas_bubble: undefined
    ui_toggle_show_co2_bubble: undefined
}


export const ui_pub_sub = pub_sub_factory<UIMsgMap>()
