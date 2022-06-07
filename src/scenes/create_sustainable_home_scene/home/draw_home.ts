import { Scene, Vector3 } from "@babylonjs/core"
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
    draw_walls({ scene: args.scene, position: args.position })
}
