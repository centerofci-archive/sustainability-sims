import React, { FunctionComponent, useMemo } from "react"
import * as GUI from "@babylonjs/gui"
import { connect, ConnectedProps } from "react-redux"

import { ACTIONS } from "../../state/actions"
import { SustainableHomeRootState } from "../../state/state"
import { Modal } from "../modal/Modal"
import { selector_modal_content_height } from "../modal/selector_modal_height"
import { AdvancedDynamicTexture } from "@babylonjs/gui"
import { ButtonCallToAction } from "../ButtonCallToAction"



interface OwnProps
{
    ui_layer: AdvancedDynamicTexture | undefined
}

const map_state = (state: SustainableHomeRootState) =>
{
    return {
        modal_content_height_in_pixels: selector_modal_content_height(state),
    }
}


const map_dispatch =
{
    change_view: ACTIONS.routing.change_view,
}


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps



const _UILandingScreen = (props: Props) =>
{
    const welcome_text = `\n\nWe all want to live in homes that don't cost us the earth. \n\n If you want to live in a (financially) sustainable way and want to know where to start then you are in the right place! \n\n Select and customise your current home, then plan improvements to it and see how they will get you a home that's good for you, and good for the planet! \n\n`

    // Can not figure out how the padding works for scrollViewer + textblock
    const paddingLeftRightInPixels = 5


    const button_start_on_pointer_down = useMemo(() => () =>
    {
        props.change_view({ view: "home_selection_menu" })
    }, [])


    return <Modal title="Welcome!">
        <scrollViewer
            name="welcome screen"
            heightInPixels={props.modal_content_height_in_pixels}
            thickness={0}
            paddingLeftInPixels={paddingLeftRightInPixels}
            paddingRightInPixels={paddingLeftRightInPixels}
        >
            <stackPanel name="stack panel welcome">
                <textBlock
                    name="content text"
                    verticalAlignment={GUI.Control.VERTICAL_ALIGNMENT_TOP}
                    text={welcome_text}
                    fontSize={36}
                    fontWeight="bold"
                    color="white"
                    textWrapping={GUI.TextWrapping.WordWrap}
                    resizeToFit={true}
                    paddingLeftInPixels={paddingLeftRightInPixels}
                    paddingRightInPixels={paddingLeftRightInPixels}
                    paddingBottomInPixels={5}
                />

                <ButtonCallToAction
                    text="START"
                    on_pointer_down={button_start_on_pointer_down}
                />

            </stackPanel>
        </scrollViewer>
    </Modal>
}

export const UILandingScreen = connector(_UILandingScreen) as FunctionComponent<OwnProps>
