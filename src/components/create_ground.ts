import * as BABYLON from "@babylonjs/core"



export function create_ground (scene: BABYLON.Scene)
{
    // Our built-in "ground" shape.
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 40, height: 40 }, scene)
    ground.receiveShadows = true

    return ground
}
