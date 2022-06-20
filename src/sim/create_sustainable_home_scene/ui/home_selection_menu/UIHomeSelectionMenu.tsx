import React, { useState } from "react"
import { FunctionComponent } from "react"
import { connect, ConnectedProps } from "react-redux"
import * as GUI from "@babylonjs/gui"

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


export const OPTION_IMAGE_WIDTH = 400
export const OPTION_IMAGE_HEIGHT = 360
const OPTION_HEIGHT = OPTION_IMAGE_WIDTH

// Generated from copying console output when view === __internal_generate_option_preview_images
const houses = [
    {
        "name": "Detached",
        "image_data": "data:image/png;base64,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EQECBAgIiBsgQIAAgSQgIInNiAABAgQExA0QIECAQBIQkMRmRIAAAQIC4gYIECBAIAkISGIzIkCAAAEBcQMECBAgkAQEJLEZESBAgICAuAECBAgQSAICktiMCBAgQEBA3AABAgQIJAEBSWxGBAgQICAgboAAAQIEkoCAJDYjAgQIEBAQN0CAAAECSUBAEpsRAQIECAiIGyBAgACBJCAgic2IAAECBATEDRAgQIBAEhCQxGZEgAABAgLiBggQIEAgCQhIYjMiQIAAAQFxAwQIECCQBAQksRkRIECAgIC4AQIECBBIAgKS2IwIECBAQEDcAAECBAgkAQFJbEYECBAgICBugAABAgSSgIAkNiMCBAgQEBA3QIAAAQJJQEASmxEBAgQICIgbIECAAIEkICCJzYgAAQIEBMQNECBAgEASEJDEZkSAAAECAuIGCBAgQCAJCEhiMyJAgAABAXEDBAgQIJAEBCSxGREgQICAgLgBAgQIEEgCApLYjAgQIEBAQNwAAQIECCQBAUlsRgQIECAgIG6AAAECBJKAgCQ2IwIECBAQEDdAgAABAklAQBKbEQECBAgIiBsgQIAAgSQgIInNiAABAgQExA0QIECAQBIQkMRmRIAAAQIC4gYIECBAIAkISGIzIkCAAAEBcQMECBAgkAQEJLEZESBAgICAuAECBAgQSAICktiMCBAgQEBA3AABAgQIJAEBSWxGBAgQICAgboAAAQIEkoCAJDYjAgQIEBAQN0CAAAECSeA/mBt99MhhimkAAAAASUVORK5CYII="
    },
    {
        "name": "Flat",
        "image_data": "data:image/png;base64,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"
    }
]



const _UIHomeSelectionMenu = (props: Props) =>
{

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
                {houses.map(({ name: house_name, image_data }) =>
                {
                    const is_chosen = house_name === chosen_home

                    return <babylon-button
                        key={house_name}
                        widthInPixels={OPTION_IMAGE_WIDTH + (is_chosen ? 8 : 0)}
                        heightInPixels={OPTION_HEIGHT + (is_chosen ? 8 : 0)}
                        cornerRadius={12}
                        color={is_chosen ? "orange" : "blue"}
                        thickness={is_chosen ? 6 : 2}
                        background="white"
                        paddingTopInPixels={10 + (is_chosen ? -4 : 0)}
                        paddingBottomInPixels={10 + (is_chosen ? -4 : 0)}
                        onPointerDownObservable={() =>
                        {
                            set_chosen_home(house_name)
                        }}
                    >
                        <babylon-image
                            url={image_data}
                            width={`${OPTION_IMAGE_WIDTH}px`}
                            height={`${OPTION_IMAGE_HEIGHT}px`}
                            verticalAlignment={GUI.Control.VERTICAL_ALIGNMENT_TOP}
                        />
                    </babylon-button>
                })}
            </stackPanel>
        </CustomScrollViewer>
    </Modal>
}

export const UIHomeSelectionMenu = connector(_UIHomeSelectionMenu) as FunctionComponent<OwnProps>