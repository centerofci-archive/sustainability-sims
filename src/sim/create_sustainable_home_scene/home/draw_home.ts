import { Scene, AbstractMesh, Vector3 } from "@babylonjs/core"
import React from "react"
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

    const walls = draw_walls(args)
    walls.parent = home

    if (args.home.type !== "detached")
    {
        const wall_left = draw_walls({ ...args, position: args.position.subtract(vec3([-4, 0, 0])) })
        wall_left.parent = home

        const wall_above = draw_walls({ ...args, position: args.position.subtract(vec3([0, 2.2, 0])) })
        wall_above.parent = home
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
