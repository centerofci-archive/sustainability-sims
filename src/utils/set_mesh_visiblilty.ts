import { AbstractMesh, Node } from "@babylonjs/core"



export function set_mesh_visiblilty (mesh: AbstractMesh | Node, visibility: number)
{
    if (is_mesh(mesh)) mesh.visibility = visibility
    mesh.getChildMeshes().forEach(mesh => mesh.visibility = visibility)
}



function is_mesh (mesh: AbstractMesh | Node): mesh is AbstractMesh
{
    return (mesh as AbstractMesh).visibility !== undefined
}
