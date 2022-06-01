import { ConnectedableComponent } from "../../state/connected_component"
import { VIEWS } from "../../state/routing/state"
import { RootState } from "../../state/state"
import { draw_modal, ModalReturn } from "../modal/draw_modal"



const map_state = (state: RootState) =>
{
    const show = state.routing.view === VIEWS.home_selection_menu

    return {
        show,
    }
}
type Props = ReturnType<typeof map_state>



export const setup_UI_home_selection_menu: ConnectedableComponent<Props> = ({ scene, ui_layer }) =>
{
    let modal: ModalReturn

    function render (props: Props)
    {
        modal = draw_modal(ui_layer)
        // todo render 'home selection menu'
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
