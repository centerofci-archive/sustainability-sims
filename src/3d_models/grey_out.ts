import { AbstractMesh, Color3, StandardMaterial } from "@babylonjs/core"



let grey_material: StandardMaterial
export function grey_out (mesh: AbstractMesh)
{
    if (!grey_material)
    {
        grey_material = new StandardMaterial("grey_material", mesh.getScene())
        grey_material.diffuseColor = Color3.Gray()
        grey_material.backFaceCulling = false
        grey_material.specularColor = Color3.Gray()
    }

    mesh.material = grey_material
    mesh.getChildMeshes().forEach(mesh => mesh.material = grey_material)
}
