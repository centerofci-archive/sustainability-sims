import React from "react"
import { FunctionComponent } from "react"
import { connect, ConnectedProps } from "react-redux"

import { SustainableHomeRootState } from "../../state/state"
import { CustomScrollViewer } from "../CustomScrollViewer"
import { Modal } from "../modal/Modal"
import { selector_modal_content_height } from "../modal/selector_modal_height"



interface OwnProps {}

const map_state = (state: SustainableHomeRootState) =>
{
    return {
        modal_content_height_in_pixels: selector_modal_content_height(state),
        chosen_home: "",
    }
}

const map_dispatch = {
    // change_view: ACTIONS.routing.change_view,
}
const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


const OPTION_SIZE = 400


const _UIHomeSelectionMenu = (props: Props) =>
{
    const house_names = [
        "Semi-Detached",
        "Detached",
        "Terrace",
        "Flat",
    ]

    const is_chosen = (house_name: string) => house_name === props.chosen_home

    return <Modal title="Select Your Starting Home">
        <CustomScrollViewer
            name="select home"
            heightInPixels={props.modal_content_height_in_pixels}
            thickness={0}
            wheelPrecision={0.01}
        >
            <stackPanel
                name="homes"
            >
                {house_names.map(house_name => <rectangle
                    key={house_name}
                    widthInPixels={OPTION_SIZE}
                    heightInPixels={OPTION_SIZE}
                    cornerRadius={12}
                    color={is_chosen(house_name) ? "lightorange" : "lightblue"}
                    thickness={is_chosen(house_name) ? 6 : 2}
                    background="white"
                    paddingTopInPixels={10}
                    paddingBottomInPixels={10}
                />
                )}
            </stackPanel>
        </CustomScrollViewer>
    </Modal>
}

export const UIHomeSelectionMenu = connector(_UIHomeSelectionMenu) as FunctionComponent<OwnProps>
