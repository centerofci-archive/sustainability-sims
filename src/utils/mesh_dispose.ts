import { AbstractMesh } from "@babylonjs/core"



export function mesh_dispose (mesh: AbstractMesh)
{
    mesh.getChildMeshes().forEach(child_mesh => mesh_dispose(child_mesh))
    mesh.dispose()
}
