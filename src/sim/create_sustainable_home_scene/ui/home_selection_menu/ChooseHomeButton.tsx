import React from "react"
import { HOME_TYPE } from "../../../../data/homes/interfaces"
import { ButtonCallToAction } from "../ButtonCallToAction"
import { OPTION_IMAGE_WIDTH } from "./constants"



interface OwnProps
{
    home_type: HOME_TYPE
    choose_home_type: (home_type: HOME_TYPE) => void
    cancel_choosing_home_type: () => void
}


export const ChooseHomeButton = (props: OwnProps) =>
{
    return <stackPanel
        isVertical={true}
        widthInPixels={OPTION_IMAGE_WIDTH}

    >
        <textBlock text="" fontSize={25} resizeToFit={true} />

        <ButtonCallToAction
            text="CONFIRM"
            on_pointer_down={() => props.choose_home_type(props.home_type)}
            extra_button_props={{ width: 1 }}
        />

        <textBlock text="" fontSize={25} resizeToFit={true} />

        <ButtonCallToAction
            text="CANCEL"
            on_pointer_down={() => props.cancel_choosing_home_type()}
            extra_button_props={{ background: "white", width: 1 }}
            extra_text_props={{ color: "darkred" }}
        />

        <textBlock text="" fontSize={25} resizeToFit={true} />
    </stackPanel>

    // return <babylon-button
    //     widthInPixels={OPTION_IMAGE_WIDTH * 0.8}
    //     heightInPixels={30}
    //     cornerRadius={12}
    //     color="blue"
    //     thickness={2}
    //     background={"rgb(248,248,248)"}
    //     paddingTopInPixels={padding}
    //     paddingBottomInPixels={padding}
    //     verticalAlignment={GUI.Control.VERTICAL_ALIGNMENT_TOP}
    //     onPointerDownObservable={set_current_home_type}
    // >
}
