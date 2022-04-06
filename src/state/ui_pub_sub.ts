import { pub_sub_factory } from "../utils/pub_sub_factory"



interface UIMsgMap
{
    ui_toggle_show_gas: undefined
}


export const ui_pub_sub = pub_sub_factory<UIMsgMap>()
