import { AdvancedDynamicTexture, Control, Rectangle, StackPanel } from "@babylonjs/gui"

import { ConnectedableComponent } from "../../state/connected_component"
import { VIEWS } from "../../state/routing/state"
import { RootState } from "../../state/state"
import { draw_modal } from "../modal/draw_modal"



const map_state = (state: RootState, last_state: RootState) =>
{
    const show = state.routing.view === VIEWS.landing_screen
    const last_show = last_state.routing.view === VIEWS.landing_screen

    return {
        show,
        clean_up: !show && last_show,
    }
}
type Props = ReturnType<typeof map_state>



export const setup_UI_landing_screen: ConnectedableComponent<Props> = ({ scene, ui_layer }) =>
{
    function update (props: Props)
    {
        if (!props.show)
        {
            if (props.clean_up) {} // todo
            return
        }

        draw_modal(ui_layer)


        // todo render 'home selection menu'
    }

    return { map_state, update }
}
