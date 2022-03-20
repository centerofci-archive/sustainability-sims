import * as BABYLON from "@babylonjs/core"
import { Color4 } from "@babylonjs/core"



export function create_sky (scene: BABYLON.Scene)
{
    scene.clearColor = new Color4(0.443, 0.737, 0.945, 1)
}
