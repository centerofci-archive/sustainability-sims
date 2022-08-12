import { Vector3 } from "@babylonjs/core"
import { AdvancedDynamicTexture } from "@babylonjs/gui"
import React, { useEffect, useRef, useState } from "react"
import { useScene } from "react-babylonjs"
import { load_low_poly_house_3 } from "./assets/load_low_poly_house_3"
import { draw_home } from "./draw_home/draw_home"



interface OwnProps
{
    ui_layer: AdvancedDynamicTexture | undefined
}


type LOADING_STATE = "NOT STARTED" | "LOADING" | "LOADED"


export const HomeHomePage = (props: OwnProps) =>
{
    const scene = useScene()
    if (!scene) return null // type guard

    const [loaded_assets, set_loaded_assets] = useState<LOADING_STATE>("NOT STARTED")
    const first_render = useRef(true)

    if (loaded_assets === "NOT STARTED")
    {
        set_loaded_assets("LOADING")
        load_low_poly_house_3(() => set_loaded_assets("LOADED"))
    }

    const chimney = scene.getMeshByName("chimney")
    if (!chimney) return null
    chimney.parent?.setEnabled(false) // disable the root which will hide all meshes of the imported model


    if (first_render.current)
    {
        first_render.current = false
        draw_home({ scene, position: Vector3.Zero(), home: { type: "terrace" } })
    }

    return null
}
