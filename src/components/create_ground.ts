import * as BABYLON from "@babylonjs/core"
import { Color4, StandardMaterial } from "@babylonjs/core"



export function create_ground (scene: BABYLON.Scene)
{
    const size = 40
    const height = 1

    const green = new Color4(0.2, 0.3, 0, 1)
    const brown = new Color4(0.2, 0.15, 0, 1)
    const faceColors: Color4[] = [brown, brown, brown, brown, green, brown]

    // Our built-in "ground" shape.
    const ground = BABYLON.MeshBuilder.CreateBox("ground", { width: size, depth: size, height, faceColors }, scene)
    ground.position.set(0, -height/2, 0)
    ground.receiveShadows = true

    const semimatt_material = new StandardMaterial("semimatt_material", scene)
    semimatt_material.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05)
    ground.material = semimatt_material


    return ground
}
