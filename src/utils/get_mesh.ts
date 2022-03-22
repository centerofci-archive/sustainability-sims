import { Scene, Node } from "@babylonjs/core"



export function get_mesh (scene: Scene, mesh_name: string, new_mesh_name: string, parent_node: Node)
{
    return scene.getMeshByName(mesh_name)?.clone(new_mesh_name, parent_node)!
}
