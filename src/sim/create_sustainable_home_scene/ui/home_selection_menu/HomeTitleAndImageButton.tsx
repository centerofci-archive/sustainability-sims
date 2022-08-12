import React, { useMemo } from "react"
import { OPTION_IMAGE_HEIGHT, OPTION_IMAGE_WIDTH } from "./constants"
import * as GUI from "@babylonjs/gui"



interface OwnProps
{
    home_type: string
    image_data: string
    is_chosen: boolean
    set_current_home_type: (home_type: string) => void
}



const padding = 30
const text_height = 80


export const HomeTitleAndImageButton = (props: OwnProps) =>
{
    const { home_type, is_chosen } = props


    const set_current_home_type = useMemo(() => () =>
    {
        props.set_current_home_type(home_type)
    }, [props.set_current_home_type, home_type])


    return <babylon-button
        name={home_type}
        widthInPixels={OPTION_IMAGE_WIDTH + padding * 2}
        heightInPixels={OPTION_IMAGE_HEIGHT + (padding * 2) + text_height}
        cornerRadius={12}
        color={is_chosen ? "orange" : "blue"}
        thickness={is_chosen ? 6 : 2}
        background={is_chosen ? "rgb(240,244,248)" : "rgb(248,248,248)" }
        paddingTopInPixels={padding}
        paddingBottomInPixels={padding}
        verticalAlignment={GUI.Control.VERTICAL_ALIGNMENT_TOP}
        onPointerDownObservable={set_current_home_type}
    >
        <stackPanel
            name="home title and image"
            isVertical={true}
            verticalAlignment={GUI.Control.VERTICAL_ALIGNMENT_TOP}
        >
            <rectangle
                width={`${OPTION_IMAGE_WIDTH}px`}
                height={`${OPTION_IMAGE_HEIGHT}px`}
                cornerRadius={12}
                verticalAlignment={GUI.Control.VERTICAL_ALIGNMENT_TOP}
                paddingTopInPixels={padding}
                paddingBottomInPixels={padding}
            >
                <babylon-image
                    url={props.image_data}
                    width={`${OPTION_IMAGE_WIDTH}px`}
                    height={`${OPTION_IMAGE_HEIGHT}px`}
                    paddingTopInPixels={padding}
                    paddingBottomInPixels={padding}
                />
            </rectangle>

            <textBlock
                name="home-title"
                text={home_type}
                color="black"
                fontSize={30}
                fontStyle="bold"
                heightInPixels={text_height}
                textHorizontalAlignment={
                    GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
                }
                textVerticalAlignment={
                    GUI.Control.VERTICAL_ALIGNMENT_TOP
                }
            />
        </stackPanel>

    </babylon-button>
}
