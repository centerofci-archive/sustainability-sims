import * as BABYLON from "@babylonjs/core"
import { Color3 } from "@babylonjs/core"



export const SUN_NAME = "sun_direct"

export function create_sun (scene: BABYLON.Scene)
{
    const position = new BABYLON.Vector3(50, 20, 20)

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const sun_direction = new BABYLON.Vector3(0, 0, 0)
    const sun = new BABYLON.PointLight(SUN_NAME, sun_direction, scene)
    sun.position = position
    const sky = new BABYLON.HemisphericLight("sun_indirect", sun_direction, scene)

    make_sun_globe(scene, position)

    // sky.position = new BABYLON.Vector3(500, 200, 0)

    return {
        set_intensity: (intensity: number) =>
        {
            sun.intensity = intensity
            sky.intensity = intensity
        },
    }
}



function make_sun_globe (scene: BABYLON.Scene, position: BABYLON.Vector3)
{
    const sun_globe = BABYLON.MeshBuilder.CreateSphere("sun_sphere", { diameter: 1 }, scene)
    sun_globe.position = position

    const sun_glow_material = new BABYLON.StandardMaterial("sun_glow_material", scene)
    sun_glow_material.emissiveColor = new Color3(1, 1, 0.5)

    sun_globe.material = sun_glow_material
    const sun_globe_glow = new BABYLON.GlowLayer("glow", scene)
    sun_globe_glow.intensity = 10
}
