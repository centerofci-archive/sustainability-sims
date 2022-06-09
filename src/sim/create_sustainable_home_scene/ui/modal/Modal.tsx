import { Control } from "@babylonjs/gui"
import React, { FunctionComponent, ReactElement } from "react"
import { connect, ConnectedProps } from "react-redux"

import { SustainableHomeRootState } from "../../state/state"
import { selector_on_mobile } from "../../state/device_info/selectors"
import {
    selector_modal_height,
    selector_modal_content_height,
    MODAL_HEADER_HEIGHT,
} from "./selector_modal_height"



interface OwnProps
{
    title: string
    children: ReactElement
}


const map_state = (state: SustainableHomeRootState) =>
{
    return {
        on_mobile: selector_on_mobile(state),
        height_in_pixels: selector_modal_height(state),
        content_height_in_pixels: selector_modal_content_height(state),
    }
}

const map_dispatch = {
    // change_view: ACTIONS.routing.change_view,
}
const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps



function _Modal (props: Props)
{
    return <rectangle
        name="outer modal window"
        width={props.on_mobile ? 0.8 : 0.6}
        heightInPixels={props.height_in_pixels}
        cornerRadius={20}
        color="white"
        thickness={2}
        background="rgba(182, 215, 228, 0.8)"
    >
        <rectangle
            name="header"
            width={1}
            height={`${MODAL_HEADER_HEIGHT}px`}
            thickness={0}
            background="rgb(56,115,151)"
            verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
        >
            <textBlock
                name="title text"
                text={props.title}
                fontSize={48}
                fontWeight="bold"
                color="white"
            />
        </rectangle>
        <rectangle
            name="inner content"
            heightInPixels={props.content_height_in_pixels}
            top={MODAL_HEADER_HEIGHT}
            verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
            thickness={0}
            background="rgba(0, 0, 0, 0)"
        >
            {props.children}
        </rectangle>
    </rectangle>
}

export const Modal = connector(_Modal) as FunctionComponent<OwnProps>
