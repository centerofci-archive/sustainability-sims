import { Color3, GlowLayer, Nullable, StandardMaterial, Vector3 } from "@babylonjs/core"
import { AdvancedDynamicTexture } from "@babylonjs/gui"
import React, { FunctionComponent, useEffect, useState } from "react"
import { useScene } from "react-babylonjs"
import { connect, ConnectedProps } from "react-redux"
import { CustomScene } from "../../../utils/CustomScene"

import { SustainableHomeRootState } from "../state/state"
import { load_low_poly_house_3 } from "./assets/load_low_poly_house_3"
import { draw_home } from "./draw_home/draw_home"
import { HOME_TYPE } from "./interfaces"
import { MetricsUI } from "./ui/MetricsUI"



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
    const scene = useScene() as Nullable<CustomScene>
    if (!scene) return null // type guard

    const [loaded_assets, set_loaded_assets] = useState<LOADING_STATE>("NOT STARTED")

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

    return <RenderHomeHomePage scene={scene} home_type={props.home_type} />
}

export const HomeHomePage = connector(_HomeHomePage) as FunctionComponent<OwnProps>



function RenderHomeHomePage (props: { scene: CustomScene, home_type?: HOME_TYPE })
{
    const { scene, home_type = "semidetached" } = props

    useEffect(() =>
    {
        const glow_layer = new GlowLayer("glow", scene)
        glow_layer.intensity = 0.5

        const home = draw_home({ scene, position: Vector3.Zero(), home: { type: home_type } })

        const pointer_move_observer = scene.onPointerMoveObservable.add(() =>
        {
            const pick_result = scene.pick(scene.pointerX, scene.pointerY)

            if (pick_result && pick_result.pickedMesh)
            {
                const mat = pick_result.pickedMesh.material as StandardMaterial
                mat.emissiveColor = new Color3(255, 0, 0)
            }
        })

        return () =>
        {
            home.dispose()
            scene.onPointerMoveObservable.remove(pointer_move_observer)
        }
    }, [])


    return <>
        <MetricsUI />
    </>
}
