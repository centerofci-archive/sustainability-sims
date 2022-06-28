import { Scene, Node, Vector3, ShadowGenerator, MeshBuilder, AbstractMesh } from "@babylonjs/core"
import { set_mesh_enabled } from "./set_mesh_enabled"
import { set_mesh_visiblilty } from "./set_mesh_visiblilty"



interface GetMeshOptions
{
    new_mesh_name?: string
    parent_node?: Node | null
    position?: Vector3
    receive_shadows?: boolean
    shadow_generator?: ShadowGenerator
    enabled?: boolean
    visibility?: number
}

export function get_mesh (scene: Scene, mesh_name: string, options: GetMeshOptions = {})
{
    // Have to use `as (AbstractMesh | undefined)` because type of Node incorrectly
    // does not have a clone function
    let mesh = scene.getNodeByName(mesh_name) as (AbstractMesh | undefined)
    if (!mesh)
    {
        console.error(`Missing mesh: ${mesh_name}`)
        return MeshBuilder.CreateBox("missing " + mesh_name, {}, scene)
    }
    mesh = mesh.clone(options.new_mesh_name || mesh_name, null)!
    mesh.setParent(null) // Is required to clear the rotation applied to the meshes... or something
    mesh.setParent(options.parent_node || null)


    const { position, receive_shadows, shadow_generator, enabled = true, visibility } = options

    if (position) mesh.position = position


    // if (receive_shadows) mesh.receiveShadows = true
    // if (shadow_generator) shadow_generator.addShadowCaster(mesh)
    mesh.getChildMeshes().forEach(mesh =>
    {
        if (receive_shadows) mesh.receiveShadows = true
        if (shadow_generator) shadow_generator.addShadowCaster(mesh)
    })


    set_mesh_enabled(mesh, enabled)
    if (visibility !== undefined) set_mesh_visiblilty(mesh, visibility)


    return mesh
}



export function get_transform_node (scene: Scene, node_name: string, new_node_name: string, options: GetMeshOptions = {})
{
    const node = scene.getTransformNodeByName(node_name)?.clone(new_node_name, options.parent_node || null)!

    if (!node)
    {
        console.error(`Missing node: ${node_name}`)
        return MeshBuilder.CreateBox("missing node " + node_name, {}, scene)
    }

    const { position, receive_shadows, shadow_generator, visibility } = options

    if (position) node.position = position


    // if (receive_shadows) node.receiveShadows = true
    // if (shadow_generator) shadow_generator.addShadowCaster(node)
    node.getChildMeshes().forEach(mesh =>
    {
        if (receive_shadows) mesh.receiveShadows = true
        if (shadow_generator) shadow_generator.addShadowCaster(mesh)
    })


    if (visibility !== undefined) set_mesh_visiblilty(node, visibility)


    return node
}
