import { Scene, Node, Vector3, ShadowGenerator } from "@babylonjs/core"



interface GetMeshOptions
{
    parent_node?: Node | null
    position?: Vector3
    receive_shadows?: boolean
    shadow_generator?: ShadowGenerator
}

export function get_mesh (scene: Scene, mesh_name: string, new_mesh_name: string, options: GetMeshOptions = {})
{
    const mesh = scene.getMeshByName(mesh_name)?.clone(new_mesh_name, options.parent_node || null)!

    const { position, receive_shadows, shadow_generator } = options

    if (position) mesh.position = position

    const children = mesh.getChildMeshes()
    if (receive_shadows) children.forEach(mesh => mesh.receiveShadows = true)
    if (shadow_generator) children.forEach(mesh => shadow_generator.addShadowCaster(mesh))

    return mesh
}
