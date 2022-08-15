import { Control } from "@babylonjs/gui"
import React, { FunctionComponent, useMemo } from "react"
import { connect, ConnectedProps } from "react-redux"
import { ACTIONS } from "../../state/actions"

import { SustainableHomeRootState } from "../../state/state"
import { ToggleSwitch } from "../../ui/ToggleSwitch"
import { CostsPanel } from "./CostsPanel"



interface OwnProps {}

const map_state = (state: SustainableHomeRootState) =>
{
    return {
        is_current: state.routing.is_current_not_future,
    }
}

const map_dispatch = {
    change_current_future: ACTIONS.routing.change_current_future,
}
const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps



function _MetricsUI (props: Props)
{
    const on_change_toggle_current_future = useMemo(() =>
    {
        return (new_cf: 1 | 2) =>
        {
            props.change_current_future({ is_current: new_cf === 1 })
        }
    }, [props.change_current_future])

    return <stackPanel
        name="metrics-ui-stack"
        isVertical={true}
        verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
    >
        <ToggleSwitch
            text1="Current"
            text2="Future"
            width1={210}
            width2={190}
            option_selected={props.is_current ? 1 : 2}
            changed_selection={on_change_toggle_current_future}
            paddingTopInPixels={30}
        />

        <CostsPanel />
    </stackPanel>

}

export const MetricsUI = connector(_MetricsUI) as FunctionComponent<OwnProps>
