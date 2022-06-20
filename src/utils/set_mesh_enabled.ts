import { AbstractMesh, Node } from "@babylonjs/core"



export function set_mesh_enabled (mesh: AbstractMesh | Node, enabled: boolean)
{
    if (is_mesh(mesh)) mesh.setEnabled(enabled)
    mesh.getChildMeshes().forEach(mesh => mesh.setEnabled(enabled))
}



function is_mesh (mesh: AbstractMesh | Node): mesh is AbstractMesh
{
    return (mesh as AbstractMesh).setEnabled !== undefined
}
