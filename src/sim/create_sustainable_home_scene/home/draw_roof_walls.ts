import { Scene, TransformNode, Vector3 } from "@babylonjs/core"

import { get_mesh } from "../../../utils/get_mesh"
import { vec3 } from "../../../utils/vector"
import { ROOF_RIDGE_1_Y_OFFSET, ROOF_Y_INCREASE } from "./draw_roof"
import { HEIGHT_OF_ONE_STORY, THICKNESS_OF_ONE_WALL } from "./draw_walls"



interface DrawRoofWallsArgs
{
    scene: Scene
    parent_node: TransformNode
    position: Vector3
    length: number
    side: "right" | "left"
    rotation?: number
}

export function draw_roof_walls (args: DrawRoofWallsArgs)
{
    const roof_wall_parent = new TransformNode("roof_wall_parent")
    roof_wall_parent.parent = args.parent_node
    roof_wall_parent.position = args.position.clone()

    const x_offset = args.side === "left" ? 0 : THICKNESS_OF_ONE_WALL

    const roof_slope_wall = get_mesh(args.scene, "roof_slope_wall", {
        parent_node: roof_wall_parent,
        position: vec3(x_offset, 0, 0),
    })
    roof_slope_wall.rotation = vec3(Math.PI, -Math.PI/2, 0)


    if (args.length > 1)
    {
        const lower_wall_to_clone = get_mesh(args.scene, "wall", {
            parent_node: roof_wall_parent,
        })

        for (let z = 1; z < args.length; ++z)
        {
            const wall_part = roof_slope_wall.clone(`roof_slope_wall_${z}`, roof_wall_parent)!
            const y = z * ROOF_Y_INCREASE
            wall_part.position = vec3(x_offset, y, -z)

            const lower_wall_part = lower_wall_to_clone.clone(`roof_slope_lower_wall_${z}`, roof_wall_parent)!
            lower_wall_part.position = vec3(x_offset, 0, -z)
            lower_wall_part.rotation = vec3(Math.PI, -Math.PI/2, 0)
            lower_wall_part.scaling = vec3(1, -(y / HEIGHT_OF_ONE_STORY), 1)
        }

        lower_wall_to_clone.dispose()
    }


    if (args.rotation)
    {
        roof_wall_parent.rotation = vec3(0, args.rotation, 0)
    }
}



interface DrawRoofRidgeWallsArgs
{
    scene: Scene
    parent_node: TransformNode
    position: Vector3
    y: number
    side: string
}

export function draw_roof_ridge_wall (args: DrawRoofRidgeWallsArgs)
{
    const roof_ridge_wall_parent = new TransformNode("roof_ridge_wall_parent")
    roof_ridge_wall_parent.parent = args.parent_node
    roof_ridge_wall_parent.position = args.position.clone()

    const x_offset = args.side === "left" ? 0 : THICKNESS_OF_ONE_WALL
    const y_offset = args.y + ROOF_RIDGE_1_Y_OFFSET

    const roof_ridge_1_wall = get_mesh(args.scene, "roof_ridge_1_wall", {
        parent_node: roof_ridge_wall_parent,
        position: vec3(x_offset, y_offset, 0),
    })
    roof_ridge_1_wall.rotation = vec3(Math.PI, -Math.PI/2, 0)

    const lower_wall = get_mesh(args.scene, "wall", {
        parent_node: roof_ridge_wall_parent,
        position: vec3(x_offset, 0, 0),
    })
    lower_wall.rotation = vec3(Math.PI, -Math.PI/2, 0)
    lower_wall.scaling = vec3(1, -(y_offset / HEIGHT_OF_ONE_STORY), 1)
}
