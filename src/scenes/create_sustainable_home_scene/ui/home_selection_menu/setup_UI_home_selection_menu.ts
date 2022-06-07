import { PointerEventTypes } from "@babylonjs/core"
import { Rectangle, ScrollViewer, StackPanel } from "@babylonjs/gui"
import { ContentCommonArgs } from "../../../content"
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
type StateProps = ReturnType<typeof map_state>


interface LocalProps
{
    chosen_home: number | undefined
}

type Props = StateProps & LocalProps


export const setup_UI_home_selection_menu = (common_args: ContentCommonArgs): ConnectedableComponent<StateProps, LocalProps> => update_local =>
{
    let modal: ModalReturn


    function initial_local ()
    {
        return { chosen_home: undefined }
    }


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
            const is_chosen = index === props.chosen_home

            const option_panel = new Rectangle()
            option_panel.widthInPixels = width
            option_panel.heightInPixels = 200
            option_panel.cornerRadius = 12
            option_panel.color = is_chosen ? "lightorange" : "lightblue"
            option_panel.thickness = is_chosen ? 6 : 2
            option_panel.background = "white"

            option_panel.onPointerMoveObservable.add(() =>
            {
                debugger
                update_local({ chosen_home: index })
            })
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


    return { map_state, initial_local, render, update, dispose }
}
