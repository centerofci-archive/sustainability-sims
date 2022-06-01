import { AdvancedDynamicTexture, Control, Rectangle, StackPanel } from "@babylonjs/gui"

import { ConnectedableComponent } from "../../state/connected_component"
import { VIEWS } from "../../state/routing/state"
import { RootState } from "../../state/state"
import { draw_modal, ModalReturn } from "../modal/draw_modal"



const map_state = (state: RootState) =>
{
    const show = state.routing.view === VIEWS.landing_screen

    return {
        show,
    }
}
type Props = ReturnType<typeof map_state>



export const setup_UI_landing_screen: ConnectedableComponent<Props> = ({ scene, ui_layer }) =>
{
    let modal: ModalReturn

    function render (props: Props)
    {
        modal = draw_modal(ui_layer)
    }

    function update (props: Props)
    {

    }

    function dispose (props: Props)
    {
        modal.dispose()
    }

    return { map_state, render, update, dispose }
}
