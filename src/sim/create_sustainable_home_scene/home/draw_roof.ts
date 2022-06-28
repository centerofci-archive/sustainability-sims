import { Scene, TransformNode, Vector3 } from "@babylonjs/core"
import { get_mesh } from "../../../utils/get_mesh"
import { vec3 } from "../../../utils/vector"
import { draw_roof_ridge_wall, draw_roof_walls } from "./draw_roof_walls"



export const ROOF_Y_INCREASE = 0.94
export const ROOF_RIDGE_1_Y_OFFSET = -0.2


interface DrawRoofArgs
{
    scene: Scene
    parent_node: TransformNode
    position: Vector3
    width: number
    depth: number
    rotation?: number
    walls?: "right" | "left" | "both" | "neither"
}

export function draw_roof (args: DrawRoofArgs)
{
    const roof_parent = new TransformNode("roof_parent")
    roof_parent.parent = args.parent_node
    roof_parent.position = args.position.clone()

    const roof_slope = get_mesh(args.scene, "roof_slope")

    for (let x = 0; x < args.width; ++x)
    {
        for (let z = 0; z < args.depth; ++z)
        {
            const roof_part = roof_slope.clone(`roof_slope_${x}_${z}`, roof_parent)!
            roof_part.position = vec3(x - 0.005, z * ROOF_Y_INCREASE, -z + 0.005)
            roof_part.scaling = vec3(1.01, -1.01, 1.01)
        }
    }


    if (args.rotation) roof_parent.rotation = vec3(0, args.rotation, 0)


    roof_slope.dispose()

    const { walls = "both" } = args

    // roof walls on right
    if (walls === "both" || walls === "right")
    {
        draw_roof_walls({
            scene: args.scene,
            parent_node: roof_parent,
            position: Vector3.Zero(),
            length: args.depth,
            side: "right",
        })
    }

    // roof walls on left
    if (walls === "both" || walls === "left")
    {
        draw_roof_walls({
            scene: args.scene,
            parent_node: roof_parent,
            position: vec3(args.width, 0, 0),
            length: args.depth,
            side: "left",
        })
    }

    return roof_parent
}



interface DrawRoofRidgeArgs
{
    scene: Scene
    parent_node: TransformNode
    position: Vector3
    width: number
    y: number
}

export function draw_roof_ridge (args: DrawRoofRidgeArgs)
{
    const roof_ridge_parent = new TransformNode("roof_ridge_parent")
    roof_ridge_parent.parent = args.parent_node
    roof_ridge_parent.position = args.position.clone()

    const roof_ridge_1 = get_mesh(args.scene, "roof_ridge_1")

    for (let x = 0; x < args.width; ++x)
    {
        const roof_ridge_1_part = roof_ridge_1.clone(`roof_ridge_1_${x}`, roof_ridge_parent)!
        roof_ridge_1_part.position = vec3(x, args.y + ROOF_RIDGE_1_Y_OFFSET, 0)
    }


    // if (args.rotation) roof_ridge_parent.rotation = args.rotation


    roof_ridge_1.dispose()


    // roof walls on right
    draw_roof_ridge_wall({
        scene: args.scene,
        parent_node: roof_ridge_parent,
        position: Vector3.Zero(),
        y: args.y,
        side: "right",
    })

    // roof walls on left
    draw_roof_ridge_wall({
        scene: args.scene,
        parent_node: roof_ridge_parent,
        position: vec3(args.width, 0, 0),
        y: args.y,
        side: "left",
    })


    return roof_ridge_parent
}
