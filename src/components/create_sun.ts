import * as BABYLON from "babylonjs"



export function create_sun (scene: BABYLON.Scene)
{
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const sun_direction = new BABYLON.Vector3(0, 0, 0)
    const sun = new BABYLON.PointLight("dir01", sun_direction, scene)
    sun.position = new BABYLON.Vector3(500, 200, 0)

    return sun
}
