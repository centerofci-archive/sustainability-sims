import { Container, Control, Rectangle, TextBlock } from "@babylonjs/gui"
import React, { ReactElement } from "react"

import { ContentCommonArgs } from "../../../content"
import { get_store } from "../../../../state/store"



interface OwnProps
{
    title: string
    children: ReactElement
}

export function Modal (props: OwnProps)
{
    // const store = get_store()
    // const state = store.getState().sustainable_home

    const on_mobile = false // state.device_info.screen_width < 600

    const header_height = 50

    return <rectangle
        name="outer modal window"
        width={on_mobile ? 0.8 : 0.6}
        heightInPixels={on_mobile ? 500 : 350}
        cornerRadius={20}
        color="white"
        thickness={2}
        background="rgba(182, 215, 228, 0.8)"
    >
        <rectangle
            name="header"
            width={1}
            height={`${header_height}px`}
            thickness={0}
            background="rgb(56,115,151)"
            verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
        >
            <textBlock
                name="title text"
                text={props.title}
                fontSize={24}
                fontWeight="bold"
                color="white"
            />
        </rectangle>
        <rectangle
            name="inner content"
            // heightInPixels={outer_window.heightInPixels - header_height}
            top={header_height}
            verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
            thickness={0}
            background="rgba(0, 0, 0, 0)"
        >
            {props.children}
        </rectangle>
    </rectangle>
}
