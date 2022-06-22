import { Scene, AbstractMesh, Vector3, Node } from "@babylonjs/core"
import React from "react"
import { create_ground } from "../../../components/create_ground"
import { get_mesh } from "../../../utils/get_mesh"
import { mesh_dispose } from "../../../utils/mesh_dispose"
import { set_mesh_enabled } from "../../../utils/set_mesh_enabled"
import { set_mesh_visiblilty } from "../../../utils/set_mesh_visiblilty"
import { vec3 } from "../../../utils/vector"

import { draw_walls, HEIGHT_OF_ONE_STORY, THICKNESS_OF_ONE_WALL } from "./draw_walls"
import { Home } from "./interfaces"



const HEIGHT_OF_GROUND_FLOOR_FLOOR = 0.3

interface DrawHomeArgs
{
    scene: Scene
    position: Vector3
    home: Home
}

export function draw_home (args: DrawHomeArgs)
{
    const width = 5
    const depth = 10
    const number_of_stories = 1

    const ground = create_ground(args.scene, Math.max(width, depth) + 6, vec3([(width / 2), 0, (-depth / 2)]))

    const home = new AbstractMesh("home")

    const foundation_walls = draw_walls({
        scene: args.scene,
        parent_node: home,
        position: args.position,
        width,
        depth,
        height: HEIGHT_OF_GROUND_FLOOR_FLOOR,
        y_m: 0,
    })

    const walls = draw_walls({
        scene: args.scene,
        parent_node: home,
        position: args.position,
        width,
        depth,
        y_m: HEIGHT_OF_GROUND_FLOOR_FLOOR,
    })


    replace_with_door(args.scene, walls.front_wall.getChildren().last())
    replace_with_window(args.scene, walls.front_wall.getChildren()[2])
    replace_with_window(args.scene, walls.front_wall.getChildren()[1])
    replace_with_window(args.scene, walls.front_wall.getChildren()[0])

    replace_with_door(args.scene, walls.back_wall.getChildren().last())
    replace_with_window(args.scene, walls.back_wall.getChildren()[2])
    replace_with_window(args.scene, walls.back_wall.getChildren()[1])


    if (args.home.type !== "detached")
    {
        // set_mesh_visiblilty(wall, 0.3)

        // const wall_left = wall.clone("wall", home)!
        // wall_left.position = args.position.subtract(vec3([-1, 0, 0]))
        // set_mesh_visiblilty(wall_left, 0.3)

        // const wall_above = wall.clone("wall", home)!
        // wall_above.position = args.position.subtract(vec3([1, 0, 0]))
        // set_mesh_visiblilty(wall_above, 0.3)
    }

    if (args.home.type !== "flat")
    {
        const chimney = get_mesh(args.scene, "chimney")
    }

    // if (args.home.type === "flat")
    // {
    //     const walls = draw_walls(args)
    //     walls.parent = home
    // }

    // if (args.home.type === "flat")
    // {
    //     const walls = draw_walls(args)
    //     walls.parent = home
    // }

    return home
}



function replace_with_door (scene: Scene, door_placeholder: Node | undefined)
{
    const door = get_mesh(scene, "door_frame")
    coplace_with(door_placeholder, door)
    if (door_placeholder)
    {
        const depth_of_step = 0.5
        ;(door_placeholder as AbstractMesh).position.addInPlace(vec3([0, -HEIGHT_OF_GROUND_FLOOR_FLOOR, depth_of_step]))
        ;(door_placeholder as AbstractMesh).scaling = vec3([1, -HEIGHT_OF_GROUND_FLOOR_FLOOR / HEIGHT_OF_ONE_STORY, depth_of_step / THICKNESS_OF_ONE_WALL])
    }
}


function replace_with_window (scene: Scene, window_placeholder: Node | undefined)
{
    const window = get_mesh(scene, "window_medium")
    replace_with(window_placeholder, window)
}


function replace_with (placeholder: Node | undefined, replacement: AbstractMesh)
{
    coplace_with(placeholder, replacement)

    mesh_dispose((placeholder as any))
}


function coplace_with (placeholder: Node | undefined, replacement: AbstractMesh)
{
    if (!placeholder) return

    replacement.parent = placeholder.parent
    replacement.position = (placeholder as any).position.clone()
}
