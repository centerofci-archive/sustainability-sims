import { Scene, Vector3 } from "@babylonjs/core"

import { vec3 } from "../utils/vector"
import {
    calculate_corner_wall_points,
    DEFAULT_WALL_HEIGHT,
    draw_area_base,
    draw_corner_wall,
    draw_wall,
} from "./create_area"



export interface MissingVisualArea
{
    toggle_visible: () => void
    is_visible: () => boolean
    update_bounding_area_m2: (bounding_area_m2: number) => void
}

interface CreateMissingAreaVisualOptions
{
    height?: number
    base_height?: number
}

export function create_missing_area_visual (scene: Scene, bounding_area_apex_position: Vector3, bounding_area_m2: number, required_area_m2: number, options: CreateMissingAreaVisualOptions = {}): MissingVisualArea
{
    const height = options.height ?? DEFAULT_WALL_HEIGHT
    const base_height = options.base_height ?? 0.1
    const meshes = create_missing_area_visual_meshes(scene, bounding_area_apex_position, bounding_area_m2, height, required_area_m2, base_height)
    const meshes_ref = { current: meshes }


    let is_visible = true

    return {
        toggle_visible: () =>
        {
            is_visible = !is_visible

            meshes_ref.current.forEach(wall =>
            {
                wall.enablePointerMoveEvents = is_visible
                wall.visibility = is_visible ? 1 : 0
            })
        },
        is_visible: () => is_visible,
        update_bounding_area_m2: (bounding_area_m2: number) =>
        {
            meshes_ref.current.forEach(mesh => mesh.dispose())
            meshes_ref.current = create_missing_area_visual_meshes(scene, bounding_area_apex_position, bounding_area_m2, height, required_area_m2, base_height)
        },
    }
}



function create_missing_area_visual_meshes (scene: Scene, bounding_area_apex_position: Vector3, bounding_area_m2: number, height: number, required_area_m2: number, base_height: number)
{
    const meshes = draw_corner_wall(scene, bounding_area_apex_position, bounding_area_m2, height)

    const required_m = required_area_m2 ** 0.5

    const { x_point, z_point, far_apex } = calculate_corner_wall_points(bounding_area_m2, bounding_area_apex_position)
    const { x_far_point, far_far_apex, z_far_point } = calculate_far_wall_points(bounding_area_apex_position, required_m)

    meshes.push(draw_wall(scene, { point1: x_point, point2: x_far_point, height }))
    meshes.push(draw_wall(scene, { point1: x_far_point, point2: far_far_apex, height }))
    meshes.push(draw_wall(scene, { point1: z_point, point2: z_far_point, height }))
    meshes.push(draw_wall(scene, { point1: z_far_point, point2: far_far_apex, height }))

    const missing_area_points = [
        x_point, far_apex, z_point, z_far_point, far_far_apex, x_far_point
    ]
    meshes.push(draw_area_base(scene, { points: missing_area_points, height: base_height }))


    const start = bounding_area_apex_position
    meshes.push(draw_wall(scene, { point1: start, point2: x_point, height, color: "green" }))
    meshes.push(draw_wall(scene, { point1: x_point, point2: far_apex, height, color: "green" }))
    meshes.push(draw_wall(scene, { point1: start, point2: z_point, height, color: "green" }))
    meshes.push(draw_wall(scene, { point1: z_point, point2: far_apex, height, color: "green" }))

    const present_area_points = [
        start, x_point, far_apex, z_point
    ]
    meshes.push(draw_area_base(scene, { points: present_area_points, height: base_height, color: "green" }))

    return meshes
}



function calculate_far_wall_points (bounding_area_apex_position: Vector3, required_m: number)
{
    const far_far_apex = bounding_area_apex_position.subtract(vec3([required_m, 0, required_m]))
    const x_far_point = bounding_area_apex_position.subtract(vec3([required_m, 0, 0]))
    const z_far_point = bounding_area_apex_position.subtract(vec3([0, 0, required_m]))

    return { x_far_point, far_far_apex, z_far_point }
}
