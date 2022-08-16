import {
    Color3,
    Light,
    Mesh,
    Vector3,
} from "@babylonjs/core"
import React, { useState } from "react"



export const SUN_NAME = "sun_direct"


interface Props
{
    intensity?: number
    bias_direct?: number
    in_space?: boolean
}

export function Sun (props: Props)
{
    const {
        intensity = 1.5,
        bias_direct = 1.5,
        in_space = false,
    } = props


    const sun_position = new Vector3(50, 20, 20).scale(in_space ? 10 : 1)
    const sun_direction = new Vector3(0, 0, 0)
    // Using this type of lighting allows things like the low poly house, which has materials with
    // "use physical light falloff" still turned on, to be illuminated sufficiently.  Without it
    // these models are very dark (as they are relatively far from the light source)
    const falloff_type = Light.FALLOFF_STANDARD

    const sun_intensity = in_space ? 1 : intensity * bias_direct
    const sky_intensity = intensity / bias_direct

    return <>
        <pointLight
            name={SUN_NAME}
            direction={sun_direction}
            position={sun_position}
            falloffType={falloff_type}
            intensity={sun_intensity}
        />
        {!in_space && <hemisphericLight
            name="sun_indirect"
            direction={sun_direction}
            falloffType={falloff_type}
            intensity={sky_intensity}
        />}

        <SunGlobe
            position={sun_position}
            scaling={in_space ? new Vector3(10, 10, 10) : undefined}
        />
    </>
}



const sun_emissive_color = new Color3(1, 1, 0.5)
function SunGlobe (props: { position: Vector3, scaling?: Vector3 })
{
    const [sub_mesh, set_sun_mesh] = useState<Mesh>()

    const sun_jsx = <sphere
        name="sun_sphere"
        diameter={1}
        position={props.position}
        scaling={props.scaling}
        onCreated={set_sun_mesh}
    >
        <standardMaterial
            name="sun_glow_material"
            emissiveColor={sun_emissive_color}
        />
    </sphere>


    return <>
        {sun_jsx}
        <glowLayer
            name="glow"
            intensity={10}
            addIncludedOnlyMesh={sub_mesh}
        />
    </>
}
