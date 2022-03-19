import * as BABYLON from "@babylonjs/core"



export function create_ground (scene: BABYLON.Scene)
{
    // Our built-in "ground" shape.
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene)
    ground.receiveShadows = true

    return ground
}
