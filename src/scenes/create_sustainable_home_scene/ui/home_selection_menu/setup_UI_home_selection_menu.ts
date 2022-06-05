import { PointerEventTypes } from "@babylonjs/core"
import { Rectangle, ScrollViewer, StackPanel } from "@babylonjs/gui"
import { ConnectedableComponent } from "../../state/connected_component"
import { VIEWS } from "../../state/routing/state"
import { RootState } from "../../state/state"
import { CustomScrollViewer } from "../CustomScrollViewer"
import { draw_modal, ModalReturn } from "../modal/draw_modal"



const map_state = (state: RootState) =>
{
    const show = state.routing.view === VIEWS.home_selection_menu

    return {
        show,
    }
}
type Props = ReturnType<typeof map_state>



export const setup_UI_home_selection_menu: ConnectedableComponent<Props> = common_args =>
{
    let modal: ModalReturn

    function render (props: Props)
    {
        modal = draw_modal(common_args, "Select Your Starting Home")

        const scroll_viewer = new CustomScrollViewer(common_args, "select home")
        // scroll_viewer.rotation = Math.PI
        scroll_viewer.heightInPixels = modal.inner_content.heightInPixels
        scroll_viewer.thickness = 0
        scroll_viewer.wheelPrecision = 0.01
        modal.inner_content.addControl(scroll_viewer)


        const stack = new StackPanel("homes")
        scroll_viewer.addControl(stack)


        const house_names = [
            "Semi-Detached",
            "Detached",
            "Terrace",
            "Flat",
        ]

        const width = 200
        house_names.forEach((house_name, index) =>
        {
            const option_panel = new Rectangle()
            option_panel.widthInPixels = width
            option_panel.heightInPixels = 200
            option_panel.cornerRadius = 12
            option_panel.color = "lightblue"
            option_panel.thickness = 2
            option_panel.background = "white"
            // option_panel.left = (index * width) + 20
            stack.addControl(option_panel)
        })
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
