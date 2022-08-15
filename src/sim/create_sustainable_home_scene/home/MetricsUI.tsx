import { Control } from "@babylonjs/gui"
import React, { useMemo, useState } from "react"

import { ToggleSwitch } from "../ui/ToggleSwitch"



export function MetricsUI ()
{
    const [cf, set_cf] = useState<1 | 2>(1)

    const on_change_toggle_current_future = useMemo(() =>
    {
        return (new_cf: 1 | 2) =>
        {
            set_cf(new_cf)
        }
    }, [])

    return <stackPanel
        isVertical={true}
        verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
    >
        <ToggleSwitch
            text1="Current"
            text2="Future"
            width1={210}
            width2={190}
            option_selected={cf}
            changed_selection={on_change_toggle_current_future}
            paddingTopInPixels={30}
        />
    </stackPanel>

}
