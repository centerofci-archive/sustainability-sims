import { Scene, ShadowGenerator, TransformNode, Vector3 } from "@babylonjs/core"
import { get_mesh } from "../utils/get_mesh"
import { set_mesh_visiblilty } from "../utils/set_mesh_visiblilty"



export const mesh_name_low_poly_house_2_walls = "low_poly_house_2_walls"
export const mesh_name_low_poly_house_2_roof = "low_poly_house_2_roof"
export const mesh_name_low_poly_house_2_door_frame = "low_poly_house_2_door_frame"
export const mesh_name_low_poly_house_2_door = "low_poly_house_2_door"


export function create_house (scene: Scene, shadow_generator: ShadowGenerator, position: Vector3, name: string)
{
    const house_parent = new TransformNode("house_parent_" + name)

    const mesh_name__door_frame = "house_door_frame_" + name
    const mesh_name__door = "house_door_" + name
    const house_walls = get_mesh(scene, mesh_name_low_poly_house_2_walls, "house_walls_" + name, house_parent)
    const house_roof = get_mesh(scene, mesh_name_low_poly_house_2_roof, "house_roof_" + name, house_parent)
    const house_door_frame = get_mesh(scene, mesh_name_low_poly_house_2_door_frame, mesh_name__door_frame, house_parent)
    const house_door = get_mesh(scene, mesh_name_low_poly_house_2_door, mesh_name__door, house_parent)

    house_parent.getChildMeshes().forEach(mesh =>
    {
        if (mesh.name !== mesh_name_low_poly_house_2_door && mesh.name !== mesh_name_low_poly_house_2_door_frame)
        {
            shadow_generator.addShadowCaster(mesh)
        }

        // Allow houses to be shadowed
        mesh.receiveShadows = true
    })

    set_mesh_visiblilty(house_parent, 1)
}
