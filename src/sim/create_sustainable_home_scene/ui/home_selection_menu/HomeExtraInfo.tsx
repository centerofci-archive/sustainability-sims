import React from "react"
import * as GUI from "@babylonjs/gui"
import { HomeStats } from "../../../../data/homes/interfaces"



interface OwnProps
{
    home_stats: HomeStats
}


export const HomeExtraInfo = (props: OwnProps) =>
{
    return <textBlock
        name="selection-made"
        text={"Selected"}
        color="black"
        fontSize={30}
        fontStyle="bold"
        heightInPixels={30}
        textHorizontalAlignment={
            GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
        }
        textVerticalAlignment={
            GUI.Control.VERTICAL_ALIGNMENT_TOP
        }
    />
}
