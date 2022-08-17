import { Color3, GlowLayer, Mesh, Nullable, StandardMaterial, Vector3 } from "@babylonjs/core"
import { AdvancedDynamicTexture } from "@babylonjs/gui"
import React, { FunctionComponent, useEffect, useRef, useState } from "react"
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



const COLOR_EMISSIVE_NONE = new Color3(0, 0, 0)
const COLOR_EMISSIVE_SELECTION = new Color3(0, 30, 255)

function RenderHomeHomePage (props: { scene: CustomScene, home_type?: HOME_TYPE })
{
    const { scene, home_type = "semidetached" } = props

    const highlighted_mesh = useRef<Mesh>()


    useEffect(() =>
    {
        // const highlight_layer = new HighlightLayer("home highlight layer", scene)

        const glow_layer = new GlowLayer("glow", scene)
        glow_layer.intensity = 0.5


        const home = draw_home({ scene, position: Vector3.Zero(), home: { type: home_type } })

        const pointer_move_observer = scene.onPointerMoveObservable.add(() =>
        {
            const pick_result = scene.pick(scene.pointerX, scene.pointerY)

            if (highlighted_mesh.current)
            {
                // highlight_layer.removeMesh(highlighted_mesh.current)
                glow_layer.removeIncludedOnlyMesh(highlighted_mesh.current)
                ;(highlighted_mesh.current!.material as StandardMaterial).emissiveColor = COLOR_EMISSIVE_NONE
            }

            if (pick_result && pick_result.pickedMesh)
            {
                // highlight_layer.addMesh(pick_result.pickedMesh as Mesh, COLOR_EMISSIVE_SELECTION)
                const mat = pick_result.pickedMesh.material as StandardMaterial
                mat.emissiveColor = COLOR_EMISSIVE_SELECTION
                highlighted_mesh.current = pick_result.pickedMesh as Mesh
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
