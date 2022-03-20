import * as BABYLON from "@babylonjs/core"
import { StandardMaterial } from "@babylonjs/core"



export function create_ground (scene: BABYLON.Scene)
{
    // Our built-in "ground" shape.
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 40, height: 40 }, scene)
    ground.receiveShadows = true

    const material = new StandardMaterial("ground_green_brown", scene)
    material.diffuseColor = new BABYLON.Color3(0.2, 0.3, 0)
    ground.material = material

    return ground
}
