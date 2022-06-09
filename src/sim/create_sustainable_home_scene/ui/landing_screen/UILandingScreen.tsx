import React, { FunctionComponent } from "react"
import * as GUI from "@babylonjs/gui"
import { connect, ConnectedProps } from "react-redux"

import { ACTIONS } from "../../state/actions"
import { VIEWS } from "../../state/routing/state"
import { SustainableHomeRootState } from "../../state/state"
import { Modal } from "../modal/Modal"



interface OwnProps {}

const map_state = (state: SustainableHomeRootState) =>
{
    const show = state.routing.view === VIEWS.landing_screen

    return {
        show,
    }
}


const map_dispatch = {
    change_view: ACTIONS.routing.change_view,
}


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps



const _UILandingScreen = (props: Props) =>
{
    // TODO make modal
    // modal = draw_modal(common_args, "Welcome!")

    const welcome_text = `\n\nWe all want to live in homes that don't cost us the earth. \n\n If you want to live in a (financially) sustainable way and want to know where to start then you are in the right place! \n\n Select and customise your current home, then plan improvements to it and see how they all add up to get you to a home that is good for you, and good for the planet! \n\n`

    // Can not figure out how the padding works for scrollViewer + textblock
    const paddingLeftInPixels = 5


    return <Modal title="Welcome!">
        <scrollViewer
            name="welcome screen"
            // heightInPixels={modal.inner_content.heightInPixels}
            thickness={0}
            paddingLeftInPixels={paddingLeftInPixels}
        >
            <stackPanel name="stack panel welcome">
                <textBlock
                    name="content text"
                    verticalAlignment={GUI.Control.VERTICAL_ALIGNMENT_TOP}
                    text={welcome_text}
                    fontSize={18}
                    fontWeight="bold"
                    color="white"
                    textWrapping={GUI.TextWrapping.WordWrap}
                    resizeToFit={true}
                    paddingLeftInPixels={paddingLeftInPixels}
                />

                <babylon-button
                    width={0.7}
                    height="30px"
                    color="black"
                    background="orange"
                    onPointerDownObservable={() =>
                    {
                        props.change_view({ view: "home_selection_menu" })
                    }}
                    paddingBottom={50}
                >
                    <textBlock
                        text=""
                        fontFamily="FontAwesome"
                        fontStyle="bold"
                        fontSize={200}
                        color="white"
                    />
                </babylon-button>
            </stackPanel>
        </scrollViewer>
    </Modal>
}

export const UILandingScreen = connector(_UILandingScreen) as FunctionComponent<OwnProps>
