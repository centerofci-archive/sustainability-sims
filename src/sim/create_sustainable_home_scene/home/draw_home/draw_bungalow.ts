import { AbstractMesh } from "@babylonjs/core"

import { draw_walls } from "../draw_walls"
import { DrawSpecificHomeArgs, DrawSpecificHomeReturn, get_children, HEIGHT_OF_GROUND_FLOOR_FLOOR, replace_with_door } from "./common"



export function draw_bungalow (args: DrawSpecificHomeArgs): DrawSpecificHomeReturn
{
    const { width, depth } = args

    const home = new AbstractMesh("home")

    const walls = draw_walls({
        scene: args.scene,
        parent_node: home,
        position: args.position,
        width,
        depth,
        y_m: HEIGHT_OF_GROUND_FLOOR_FLOOR,
    })


    replace_with_door(args.scene, get_children(walls.front_wall).last())

    return { home, cutthrough_components: [] }
}
