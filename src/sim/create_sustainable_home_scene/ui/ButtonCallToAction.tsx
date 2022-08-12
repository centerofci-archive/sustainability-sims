import React from "react"
import { BabylonNode, FiberButtonProps, FiberButtonPropsCtor, FiberTextBlockProps, FiberTextBlockPropsCtor } from "react-babylonjs"
import { Button, TextBlock } from "@babylonjs/gui"



interface OwnProps
{
    text: string
    on_pointer_down: () => void
    extra_button_props?: Partial<FiberButtonProps & FiberButtonPropsCtor & BabylonNode<Button>>
    extra_text_props?: Partial<FiberTextBlockProps & FiberTextBlockPropsCtor & BabylonNode<TextBlock>>
}


export const ButtonCallToAction = (props: OwnProps) =>
{
    return <babylon-button
        name={`button-${props.text}`}
        width={0.7}
        height="70px"
        color="#777"
        thickness={4}
        background="orange"
        cornerRadius={20}
        onPointerDownObservable={props.on_pointer_down}
        {...props.extra_button_props}
    >
        <textBlock
            text={props.text}
            fontStyle="bold"
            fontSize={50}
            color="white"
            resizeToFit={true}
            {...props.extra_text_props}
        />
    </babylon-button>
}
