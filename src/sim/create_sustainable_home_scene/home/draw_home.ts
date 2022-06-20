import { Scene, AbstractMesh, Vector3, Node } from "@babylonjs/core"
import React from "react"
import { get_mesh } from "../../../utils/get_mesh"
import { mesh_dispose } from "../../../utils/mesh_dispose"
import { set_mesh_enabled } from "../../../utils/set_mesh_enabled"
import { set_mesh_visiblilty } from "../../../utils/set_mesh_visiblilty"
import { vec3 } from "../../../utils/vector"

import { draw_walls } from "./draw_walls"
import { Home } from "./interfaces"



interface DrawHomeArgs
{
    scene: Scene
    position: Vector3
    home: Home
}

export function draw_home (args: DrawHomeArgs)
{
    const home = new AbstractMesh("home")

    const walls = draw_walls({
        scene: args.scene,
        parent_node: home,
        position: args.position,
        width: 5,
        depth: 10,
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
    replace_with(door_placeholder, door)
}


function replace_with_window (scene: Scene, window_placeholder: Node | undefined)
{
    const window = get_mesh(scene, "window_medium")
    replace_with(window_placeholder, window)
}


function replace_with (placeholder: Node | undefined, replacement: AbstractMesh)
{
    if (!placeholder) return

    replacement.parent = placeholder.parent
    replacement.position = (placeholder as any).position.clone()

    mesh_dispose((placeholder as any))
}
