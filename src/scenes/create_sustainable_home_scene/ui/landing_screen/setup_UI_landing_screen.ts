import { AdvancedDynamicTexture, Button, Control, Rectangle, ScrollViewer, StackPanel, TextBlock, TextWrapping } from "@babylonjs/gui"
import { ContentCommonArgs } from "../../../content"
import { ACTIONS } from "../../state/actions"

import { ConnectedableComponent, connect_dispatch } from "../../state/connected_component"
import { VIEWS } from "../../state/routing/state"
import { RootState } from "../../state/state"
import { draw_modal, ModalReturn } from "../modal/draw_modal"



const dispatch = connect_dispatch({
    change_view: ACTIONS.routing.change_view,
})

const map_state = (state: RootState) =>
{
    const show = state.routing.view === VIEWS.landing_screen

    return {
        show,
        ...dispatch,
    }
}

type StateProps = ReturnType<typeof map_state>



export const setup_UI_landing_screen = (common_args: ContentCommonArgs): ConnectedableComponent<StateProps, {}> => update_local =>
{
    let modal: ModalReturn


    function render (props: StateProps)
    {
        modal = draw_modal(common_args, "Welcome!")

        const scroll_viewer = new ScrollViewer("welcome screen")
        scroll_viewer.heightInPixels = modal.inner_content.heightInPixels
        scroll_viewer.thickness = 0
        modal.inner_content.addControl(scroll_viewer)


        const stack = new StackPanel("stack panel welcome")

        const welcome_text = `\n\nWe all want to live in homes that don't cost us the earth. \n\n If you want to live in a (financially) sustainable way and want to know where to start then you are in the right place! \n\n Select and customise your current home, then plan improvements to it and see how they all add up to get you to a home that is good for you, and good for the planet! \n\n`

        const content_text = new TextBlock("content text")
        content_text.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        content_text.text = welcome_text
        content_text.fontSize = 18
        content_text.fontWeight = "bold"
        content_text.color = "white"
        content_text.textWrapping = TextWrapping.WordWrap
        content_text.resizeToFit = true
        stack.addControl(content_text)

        // Can not figure out how the padding works
        scroll_viewer.paddingLeftInPixels = 5
        content_text.paddingRightInPixels = 5

        const button_start = Button.CreateSimpleButton("start", "Start")
        button_start.width = 0.7
        button_start.height = `30px`
        button_start.color = "black"
        button_start.background = "orange"
        button_start.onPointerClickObservable.add(() =>
        {
            props.change_view({ view: "home_selection_menu" })
        })
        stack.addControl(button_start)

        const bottom_padding = new TextBlock("content text")
        bottom_padding.heightInPixels = 40
        bottom_padding.resizeToFit = true
        stack.addControl(bottom_padding)

        scroll_viewer.addControl(stack)

    }


    function update (props: StateProps)
    {

    }


    function dispose (props: StateProps)
    {
        modal.dispose()
    }


    return { map_state, render, update, dispose }
}
