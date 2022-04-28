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
}

export function create_missing_area_visual (scene: Scene, bounding_area_apex_position: Vector3, bounding_area: number, required_area: number, height = DEFAULT_WALL_HEIGHT): MissingVisualArea
{
    const meshes = draw_corner_wall(scene, bounding_area_apex_position, bounding_area, height)

    const required_m = required_area ** 0.5

    const { x_point, z_point, far_apex } = calculate_corner_wall_points(bounding_area, bounding_area_apex_position)

    const far_far_apex = bounding_area_apex_position.subtract(vec3([required_m, 0, required_m]))
    const x_far_point = bounding_area_apex_position.subtract(vec3([required_m, 0, 0]))
    const z_far_point = bounding_area_apex_position.subtract(vec3([0, 0, required_m]))

    meshes.push(draw_wall(scene, { point1: x_point, point2: x_far_point, height }))
    meshes.push(draw_wall(scene, { point1: x_far_point, point2: far_far_apex, height }))
    meshes.push(draw_wall(scene, { point1: z_point, point2: z_far_point, height }))
    meshes.push(draw_wall(scene, { point1: z_far_point, point2: far_far_apex, height }))

    const points = [
        x_point, far_apex, z_point, z_far_point, far_far_apex, x_far_point
    ]

    meshes.push(draw_area_base(scene, { points, height: 0.1 }))

    let is_visible = true

    return {
        toggle_visible: () =>
        {
            is_visible = !is_visible

            meshes.forEach(wall =>
            {
                wall.enablePointerMoveEvents = is_visible
                wall.visibility = is_visible ? 1 : 0
            })
        }
    }
}
