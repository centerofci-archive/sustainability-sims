import { ConnectedableComponent } from "../../state/connected_component"
import { VIEWS } from "../../state/routing/state"
import { RootState } from "../../state/state"



const map_state = (state: RootState, last_state: RootState) =>
{
    const show = state.routing.view === VIEWS.home_selection_menu
    const last_show = last_state.routing.view === VIEWS.home_selection_menu

    return {
        show: state.routing.view === VIEWS.home_selection_menu,
        clean_up: !show && last_show,
    }
}
type Props = ReturnType<typeof map_state>



export const setup_UI_home_selection_menu: ConnectedableComponent<Props> = () =>
{
    function update (props: Props)
    {
        if (!props.show)
        {
            if (props.clean_up) // todo
            return
        }

        // todo render 'home selection menu'
    }

    return { map_state, update }
}
