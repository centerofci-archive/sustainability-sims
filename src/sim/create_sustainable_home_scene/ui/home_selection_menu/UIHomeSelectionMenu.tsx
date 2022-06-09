import React, { useState } from "react"
import { FunctionComponent } from "react"
import { connect, ConnectedProps } from "react-redux"
import { ACTIONS } from "../../state/actions"

import { SustainableHomeRootState } from "../../state/state"
import { CustomScrollViewer } from "../CustomScrollViewer"
import { Modal } from "../modal/Modal"
import { selector_modal_content_height } from "../modal/selector_modal_height"



interface OwnProps {}

const map_state = (state: SustainableHomeRootState) =>
{
    return {
        modal_content_height_in_pixels: selector_modal_content_height(state),
    }
}

const map_dispatch = {
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

    const [chosen_home, set_chosen_home] = useState("")

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
                {house_names.map(house_name =>
                {
                    const is_chosen = house_name === chosen_home

                    return <rectangle
                        key={house_name}
                        widthInPixels={OPTION_SIZE + (is_chosen ? 8 : 0)}
                        heightInPixels={OPTION_SIZE + (is_chosen ? 8 : 0)}
                        cornerRadius={12}
                        color={is_chosen ? "orange" : "blue"}
                        thickness={is_chosen ? 6 : 2}
                        background="white"
                        paddingTopInPixels={10 + (is_chosen ? -4 : 0)}
                        paddingBottomInPixels={10 + (is_chosen ? -4 : 0)}
                        onPointerDownObservable={() =>
                        {
                            console.log(house_name)
                            set_chosen_home(house_name)
                        }}
                    />
                })}
            </stackPanel>
        </CustomScrollViewer>
    </Modal>
}

export const UIHomeSelectionMenu = connector(_UIHomeSelectionMenu) as FunctionComponent<OwnProps>
