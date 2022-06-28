import { AbstractMesh, Node, TransformNode } from "@babylonjs/core"



export function set_mesh_visiblilty (mesh: TransformNode | Node | undefined, visibility: number)
{
    if (is_mesh(mesh)) mesh.visibility = visibility
    mesh?.getChildMeshes().forEach(mesh => mesh.visibility = visibility)
}



function is_mesh (mesh: AbstractMesh | Node | undefined): mesh is AbstractMesh
{
    return (mesh as AbstractMesh).visibility !== undefined
}
