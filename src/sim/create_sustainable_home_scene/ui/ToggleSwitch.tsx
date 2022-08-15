import { Control } from "@babylonjs/gui"
import React from "react"



interface Props
{
    text1: string
    text2: string
    width1: number
    width2: number
    option_selected: 1 | 2
    changed_selection: (selected: 1 | 2) => void

    paddingTopInPixels?: number
    verticalAlignment?: number
}

export function ToggleSwitch (props: Props)
{
    const text_height = 30
    const total_height = text_height * 2
    const corner_radius = total_height / 2
    const width = props.width1 + props.width2
    const opt1_selected = props.option_selected === 1


    return <rectangle
        background="#CCC"
        thickness={0}
        heightInPixels={total_height + (props.paddingTopInPixels ?? 0)}
        widthInPixels={width}
        cornerRadius={corner_radius}
        paddingTopInPixels={props.paddingTopInPixels ?? 0}
        verticalAlignment={props.verticalAlignment ?? Control.VERTICAL_ALIGNMENT_TOP}
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

        <textBlock
            text={props.text1}
            fontStyle="bold"
            fontSize={50}
            color="white"
            widthInPixels={props.width1}
            heightInPixels={total_height}
            resizeToFit={true}
            paddingLeftInPixels={corner_radius / 2}
            horizontalAlignment={Control.HORIZONTAL_ALIGNMENT_LEFT}
            onPointerDownObservable={() =>
            {
                if (props.option_selected === 2) props.changed_selection(1)
            }}
        />

        <textBlock
            text={props.text2}
            fontStyle="bold"
            fontSize={50}
            color="white"
            widthInPixels={props.width1}
            heightInPixels={total_height}
            resizeToFit={true}
            paddingRightInPixels={corner_radius / 2}
            horizontalAlignment={Control.HORIZONTAL_ALIGNMENT_RIGHT}
            onPointerDownObservable={() =>
            {
                if (props.option_selected === 1) props.changed_selection(2)
            }}
        />
    </rectangle>
}
