import * as BABYLON from "@babylonjs/core"



export const SUN_NAME = "sun_direct"

export function create_sun (scene: BABYLON.Scene)
{
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const sun_direction = new BABYLON.Vector3(0, 0, 0)
    const sun = new BABYLON.PointLight(SUN_NAME, sun_direction, scene)
    sun.position = new BABYLON.Vector3(500, 200, 200)
    const sky = new BABYLON.HemisphericLight("sun_indirect", sun_direction, scene)
    // sky.position = new BABYLON.Vector3(500, 200, 0)

    return {
        set_intensity: (intensity: number) =>
        {
            sun.intensity = intensity
            sky.intensity = intensity * 0.4
        }
    }
}
