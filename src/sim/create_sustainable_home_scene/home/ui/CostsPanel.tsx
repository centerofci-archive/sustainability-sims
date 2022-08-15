import { Control } from "@babylonjs/gui"
import React, { FunctionComponent } from "react"
import { connect, ConnectedProps } from "react-redux"
import { ACTIONS } from "../../state/actions"

import { SustainableHomeRootState } from "../../state/state"



interface OwnProps {}

const map_state = (state: SustainableHomeRootState) =>
{
    return {
    }
}

const map_dispatch = {
}
const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps



function _CostsPanel (props: Props)
{
    const padding_top = 30

    const current_cost = 5000
    const current_CO2 = 8
    const future_cost = 1000
    const future_CO2 = 3


    const cost_text = `£${current_cost} → £${future_cost}`
    const co2_text = `${current_CO2} → ${future_CO2}`


    return <rectangle
        name="costs-rect"
        background="#CCC"
        thickness={0}
        heightInPixels={125 + padding_top}
        widthInPixels={450}
        cornerRadius={30}
        paddingTopInPixels={padding_top}
        verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
    >
        <stackPanel
            name="costs-stack"
            isVertical={true}
            verticalAlignment={Control.VERTICAL_ALIGNMENT_CENTER}
        >
            <textBlock
                name="£cost"
                text={cost_text}
                fontSize={50}
                // color="white"
                resizeToFit={true}
            />

            <stackPanel
                name="other-costs-stack"
                isVertical={false}
                heightInPixels={30}
                leftInPixels={40}
                // verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
            >
                <textBlock
                    text={co2_text}
                    fontSize={30}
                    // color="white"
                    resizeToFit={true}

                />

                <textBlock
                    text="  tCO2e"
                    fontSize={20}
                    // color="white"
                    resizeToFit={true}
                    verticalAlignment={Control.VERTICAL_ALIGNMENT_BOTTOM}
                />
            </stackPanel>
        </stackPanel>
    </rectangle>
}

export const CostsPanel = connector(_CostsPanel) as FunctionComponent<OwnProps>
