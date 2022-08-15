import { Control } from "@babylonjs/gui"
import React, { useRef } from "react"



interface Props
{
    text1: string
    text2: string
    width1: number
    width2: number
    option_selected: 1 | 2
    changed_selection: (selected: 1 | 2) => void
}

export function ToggleSwitch (props: Props)
{
    const text_height = 30
    const total_height = text_height * 2
    const corner_radius = total_height / 2
    const width = props.width1 + props.width2
    const opt1_selected = props.option_selected === 1
    const target_option_selected = useRef(props.option_selected)


    return <rectangle
        background="#CCC"
        thickness={0}
        heightInPixels={total_height}
        widthInPixels={width}
        cornerRadius={corner_radius}
    >
        <rectangle
            background="#39F"
            thickness={0}
            heightInPixels={total_height}
            leftInPixels={opt1_selected ? 0 : props.width1}
            widthInPixels={opt1_selected ? props.width1 : props.width2}
            cornerRadius={corner_radius}
            horizontalAlignment={Control.HORIZONTAL_ALIGNMENT_LEFT}
        ></rectangle>

        <babylon-button
            widthInPixels={props.width1}
            heightInPixels={total_height}
            thickness={0}
            paddingLeftInPixels={corner_radius / 2}
            horizontalAlignment={Control.HORIZONTAL_ALIGNMENT_LEFT}
            onPointerDownObservable={() =>
            {
                if (props.option_selected === 2) props.changed_selection(1)
            }}
        >
            <textBlock
                text={props.text1}
                fontStyle="bold"
                fontSize={50}
                color="white"
                resizeToFit={true}
                horizontalAlignment={Control.HORIZONTAL_ALIGNMENT_LEFT}
            />
        </babylon-button>

        <babylon-button
            widthInPixels={props.width1}
            heightInPixels={total_height}
            thickness={0}
            paddingRightInPixels={corner_radius / 2}
            horizontalAlignment={Control.HORIZONTAL_ALIGNMENT_RIGHT}
            onPointerDownObservable={() =>
            {
                if (props.option_selected === 1) props.changed_selection(2)
            }}
        >
            <textBlock
                text={props.text2}
                fontStyle="bold"
                fontSize={50}
                color="white"
                resizeToFit={true}
                horizontalAlignment={Control.HORIZONTAL_ALIGNMENT_RIGHT}
            />
        </babylon-button>
    </rectangle>
}