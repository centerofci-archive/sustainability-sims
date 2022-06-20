import { Scene, ShadowGenerator, Vector3 } from "@babylonjs/core"
import { get_mesh } from "../utils/get_mesh"



const mesh_name_low_poly_house_2 = "low_poly_house_2"
const mesh_name_low_poly_house_2_chimney = "low_poly_house_2_chimney"


export function create_house (scene: Scene, shadow_generator: ShadowGenerator, position: Vector3, name: string)
{
    const house = get_mesh(scene, mesh_name_low_poly_house_2, {
        new_mesh_name: "house_" + name,
        position,
        receive_shadows: true,
        shadow_generator,
        visibility: 1,
    })

    const house_chimney = get_mesh(scene, mesh_name_low_poly_house_2_chimney, {
        new_mesh_name: "house_chimney" + name,
        position,
        receive_shadows: true,
        shadow_generator,
        visibility: 1,
    })
}
