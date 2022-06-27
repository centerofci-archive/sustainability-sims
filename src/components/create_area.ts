import { Color3, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core"
import earcut from "earcut"

import { vec3 } from "../utils/vector"



export const DEFAULT_WALL_HEIGHT = 3


export function draw_corner_wall (scene: Scene, bounding_area_apex_position: Vector3, bounding_area: number, height = DEFAULT_WALL_HEIGHT)
{
    const { far_apex, x_point, z_point } = calculate_corner_wall_points(bounding_area, bounding_area_apex_position)

    const wall1 = draw_wall(scene, { point1: far_apex, point2: x_point, height })
    const wall2 = draw_wall(scene, { point1: far_apex, point2: z_point, height })

    return [wall1, wall2]
}



export function calculate_corner_wall_points (bounding_area: number, bounding_area_apex_position: Vector3)
{
    const bounding_m = bounding_area ** 0.5
    const far_apex = bounding_area_apex_position.subtract(vec3(bounding_m, 0, bounding_m))
    const x_point = bounding_area_apex_position.subtract(vec3(bounding_m, 0, 0))
    const z_point = bounding_area_apex_position.subtract(vec3(0, 0, bounding_m))

    return { far_apex, x_point, z_point }
}



let red_a50: StandardMaterial
let green_a50: StandardMaterial
let blue_a50: StandardMaterial
function create_colors (scene: Scene)
{
    if (!red_a50)
    {
        red_a50 = new StandardMaterial("red_a50", scene)
        red_a50.diffuseColor = Color3.Red()
        red_a50.alpha = 0.5
        red_a50.backFaceCulling = false
        red_a50.specularColor = Color3.Black()
    }
    if (!green_a50)
    {
        green_a50 = new StandardMaterial("green_a50", scene)
        green_a50.diffuseColor = Color3.Green()
        green_a50.alpha = 0.5
        green_a50.backFaceCulling = false
        green_a50.specularColor = Color3.Black()
    }
    if (!blue_a50)
    {
        blue_a50 = new StandardMaterial("blue_a50", scene)
        blue_a50.diffuseColor = Color3.Blue()
        blue_a50.alpha = 0.5
        blue_a50.backFaceCulling = false
        blue_a50.specularColor = Color3.Black()
    }
}



export function draw_wall (scene: Scene, { point1, point2, height, color = "red" }: { point1: Vector3; point2: Vector3; height: number, color?: "red" | "green" | "blue" })
{
    create_colors(scene)

    const wall_vector = point2.subtract(point1)
    const width = wall_vector.length()
    const wall = MeshBuilder.CreatePlane("wall", { width, height }, scene)

    const bottom_corner = vec3(-width/2, -height/2, 0)
    wall.setPivotPoint(bottom_corner)
    wall.position = point1.subtract(bottom_corner)

    // As we have now set the pivot point at point1 and we know new planes will always be
    // created with a vector direction of 1, 0, 0 the calculate the required rotation
    // around the y-axis
    const angle_required = -Math.atan(wall_vector.z / wall_vector.x) + (wall_vector.x < 0 ? Math.PI : 0)
    wall.rotation = vec3(0, angle_required, 0)

    wall.material = color === "red" ? red_a50 : (color === "blue" ? blue_a50 : green_a50)

    return wall

    // return {
    //     wall,
    //     animate_change: (args: { new_point1?: Vector3, new_point2?: Vector3 }) =>
    //     {
    //         // todo
    //     }
    // }
}



export function draw_area_base (scene: Scene, { points, height, color = "red" }: { points: Vector3[]; height: number, color?: "red" | "green" | "blue" })
{
    create_colors(scene)

    const area_base = MeshBuilder.CreatePolygon("area_base", { shape: points }, scene, earcut)

    const height_offset = vec3(0, height, 0)
    area_base.position = height_offset

    area_base.material = color === "red" ? red_a50 : (color === "blue" ? blue_a50 : green_a50)

    return area_base
}
