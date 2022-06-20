import {
    Color3,
    Color4,
    Scene,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core"
import { get_mesh } from "../utils/get_mesh"
import { vec3 } from "../utils/vector"



const mesh_name_low_poly_arrows_1_hard = "low_poly_arrows_1_hard_arrow"
const mesh_name_low_poly_arrows_1_soft = "low_poly_arrows_1_soft_arrow"
const approx_volume_m3 = 2.35 // 2.37 for hard, 2.33 for soft


export interface CreateArrowArgs
{
    position: Vector3 | [number, number, number]
    rotation?: Vector3 | [number, number, number]
    color: Color4
    volume_m3?: number
    size?: number // alias for volume_m3 where volume_m3 takes precidence
    glow?: number
    hard?: boolean
}

export function create_arrow (scene: Scene, new_mesh_name: string, args: CreateArrowArgs)
{
    const {
        color,
        volume_m3 = (args.size || approx_volume_m3),
        hard = true,
        glow,
    } = args

    let {
        position,
        rotation,
    } = args

    position = vec3(position)
    rotation = rotation ? vec3(rotation) : rotation

    const mesh_name = hard ? mesh_name_low_poly_arrows_1_hard : mesh_name_low_poly_arrows_1_soft
    new_mesh_name = "arrow_" + (hard ? "hard_" : "soft_") + new_mesh_name

    const arrow = get_mesh(scene, mesh_name, {
        new_mesh_name,
        position,
        receive_shadows: true,
        shadow_generator: undefined,
        visibility: 1,
    })

    if (rotation)
    {
        arrow.rotation = rotation
    }

    let scale = (volume_m3 / approx_volume_m3)
    // For some reason it needs the -1 scale otherwise it flips inside out and turns upside down
    scale *= -1
    arrow.scaling = Vector3.One().scale(scale)


    const material = new StandardMaterial("arrow_colour", scene)
    material.diffuseColor = new Color3(color.r, color.g, color.b)
    material.specularColor = new Color3(0, 0, 0)
    material.emissiveColor = calculate_emissive_color(color, glow)

    // material.maxSimultaneousLights = 0
    arrow.material = material
    arrow.visibility = color.a

    return arrow
}



export function calculate_emissive_color (color: Color4, glow = 0.03)
{
    let emission_vec3 = new Vector3(color.r, color.g, color.b)
    emission_vec3.normalize()
    emission_vec3 = emission_vec3.scale(glow)
    return new Color3(emission_vec3.x, emission_vec3.y, emission_vec3.z)
}
