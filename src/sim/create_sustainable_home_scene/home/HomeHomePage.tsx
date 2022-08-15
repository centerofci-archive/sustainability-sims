import { Vector3 } from "@babylonjs/core"
import { AdvancedDynamicTexture } from "@babylonjs/gui"
import React, { FunctionComponent, useMemo, useRef, useState } from "react"
import { useScene } from "react-babylonjs"
import { connect, ConnectedProps } from "react-redux"

import { SustainableHomeRootState } from "../state/state"
import { ToggleSwitch } from "../ui/ToggleSwitch"
import { load_low_poly_house_3 } from "./assets/load_low_poly_house_3"
import { draw_home } from "./draw_home/draw_home"



interface OwnProps
{
    ui_layer: AdvancedDynamicTexture | undefined
}


const map_state = (state: SustainableHomeRootState) =>
{
    return {
        home_type: state.home.selected_default_home_type,
    }
}

const map_dispatch = {
    // change_view: ACTIONS.routing.change_view,
}
const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps

type LOADING_STATE = "NOT STARTED" | "LOADING" | "LOADED" | "FAILED"


const _HomeHomePage = (props: Props) =>
{
    const scene = useScene()
    if (!scene) return null // type guard

    const [loaded_assets, set_loaded_assets] = useState<LOADING_STATE>("NOT STARTED")
    const first_render = useRef(true)

    if (loaded_assets === "NOT STARTED")
    {
        set_loaded_assets("LOADING")
        load_low_poly_house_3(scene)
            .then(() => set_loaded_assets("LOADED"))
            .catch(err =>
            {
                set_loaded_assets("FAILED")
                console.error(`Error loading low_poly_house_3`, err)
            })
    }

    if (loaded_assets !== "LOADED") return null

    if (first_render.current)
    {
        first_render.current = false
        draw_home({ scene, position: Vector3.Zero(), home: { type: props.home_type || "semidetached" } })
    }

    return <>
        <MetricsUI />
    </>
}

export const HomeHomePage = connector(_HomeHomePage) as FunctionComponent<OwnProps>



function MetricsUI ()
{
    const [cf, set_cf] = useState<1 | 2>(2)

    const on_change_toggle_current_future = useMemo(() =>
    {
        return (new_cf: 1 | 2) =>
        {
            set_cf(new_cf)
        }
    }, [])

    return <ToggleSwitch
        text1="Current"
        text2="Future"
        width1={210}
        width2={190}
        option_selected={cf}
        changed_selection={on_change_toggle_current_future}
    />
}
