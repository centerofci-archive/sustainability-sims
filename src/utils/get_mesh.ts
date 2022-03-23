import { Scene, Node, Vector3, ShadowGenerator, MeshBuilder } from "@babylonjs/core"
import { set_mesh_visiblilty } from "./set_mesh_visiblilty"



interface GetMeshOptions
{
    parent_node?: Node | null
    position?: Vector3
    receive_shadows?: boolean
    shadow_generator?: ShadowGenerator
    visibility?: number
}

export function get_mesh (scene: Scene, mesh_name: string, new_mesh_name: string, options: GetMeshOptions = {})
{
    const mesh = scene.getMeshByName(mesh_name)?.clone(new_mesh_name, options.parent_node || null)!
    if (!mesh)
    {
        console.error(`Missing mesh: ${mesh_name}`)
        return MeshBuilder.CreateBox("missing " + mesh_name, {}, scene)
    }

    const { position, receive_shadows, shadow_generator, visibility } = options

    if (position) mesh.position = position


    if (receive_shadows) mesh.receiveShadows = true
    if (shadow_generator) shadow_generator.addShadowCaster(mesh)
    mesh.getChildMeshes().forEach(mesh =>
    {
        if (receive_shadows) mesh.receiveShadows = true
        if (shadow_generator) shadow_generator.addShadowCaster(mesh)
    })


    if (visibility !== undefined) set_mesh_visiblilty(mesh, visibility)


    return mesh
}
