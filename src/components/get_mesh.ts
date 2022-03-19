import * as BABYLON from "@babylonjs/core"



export function get_mesh (scene: BABYLON.Scene, name: string, new_name: string, parent: BABYLON.Mesh)
{
    return scene.getMeshByName(name)?.clone(new_name, parent)!
}
