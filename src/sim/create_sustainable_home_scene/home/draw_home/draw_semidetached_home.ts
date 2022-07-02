import { AbstractMesh } from "@babylonjs/core"

import { vec3 } from "../../../../utils/vector"
import { draw_chimney } from "../draw_chimney"
import { draw_floor } from "../draw_floor"
import { draw_roof, draw_roof_ridge } from "../draw_roof"
import { draw_stairs } from "../draw_stairs"
import { draw_walls, HEIGHT_OF_ONE_STORY } from "../draw_walls"
import {
    DrawSpecificHomeArgs,
    DrawSpecificHomeReturn,
    get_children,
    HEIGHT_OF_GROUND_FLOOR_FLOOR,
    replace_with_door,
    replace_with_window,
} from "./common"



export function draw_semidetached_home (args: DrawSpecificHomeArgs): DrawSpecificHomeReturn
{
    const { width, depth } = args

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


    replace_with_door(args.scene, get_children(walls.front_wall).last())
    replace_with_window(args.scene, get_children(walls.front_wall)[2], "tall")
    replace_with_window(args.scene, get_children(walls.front_wall)[1], "tall")
    replace_with_window(args.scene, get_children(walls.front_wall)[0], "tall")

    replace_with_door(args.scene, get_children(walls.back_wall).last())
    replace_with_window(args.scene, get_children(walls.back_wall)[2])
    replace_with_window(args.scene, get_children(walls.back_wall)[1])


    // floor
    draw_floor({
        scene: args.scene,
        parent_node: home,
        position: args.position,
        width,
        depth,
        y_m: HEIGHT_OF_GROUND_FLOOR_FLOOR,
        material: "wooden",
    })

    const length_of_stairs = 4
    draw_stairs({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(width - 0.01, HEIGHT_OF_GROUND_FLOOR_FLOOR, -1)),
    })


    // Floor between ground and 1st floor
    draw_floor({
        scene: args.scene,
        parent_node: home,
        position: args.position,
        width: width - 1,
        depth,
        y_m: HEIGHT_OF_GROUND_FLOOR_FLOOR + HEIGHT_OF_ONE_STORY + 0.01,
        material: "wooden",
        fudge: { x_max: 0 },
    })

    draw_floor({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(width - 1, 0, -length_of_stairs)),
        width: 1,
        depth: depth - length_of_stairs,
        y_m: HEIGHT_OF_GROUND_FLOOR_FLOOR + HEIGHT_OF_ONE_STORY + 0.01,
        material: "wooden",
        fudge: { x_min: 0 },
    })


    const upper_walls = draw_walls({
        scene: args.scene,
        parent_node: home,
        position: args.position,
        width,
        depth,
        y_m: HEIGHT_OF_GROUND_FLOOR_FLOOR + HEIGHT_OF_ONE_STORY,
    })
    const upper_left_front = get_children(upper_walls.side_left_wall).first()!
    upper_left_front.position.addInPlace(vec3(0, 0, -2))

    const upper_front = get_children(upper_walls.front_wall)
    const ufwl = upper_front.length
    const upper_front1 = upper_front.last()!
    const upper_front2 = upper_front[ufwl - 2]
    upper_front1.position.addInPlace(vec3(0, 0, -1))
    upper_front2.position.addInPlace(vec3(0, 0, -1))

    // Upper floor windows
    replace_with_window(args.scene, upper_front2, "medium")
    replace_with_window(args.scene, upper_front[ufwl - 3], "medium")
    replace_with_window(args.scene, upper_front[ufwl - 4], "medium")
    replace_with_window(args.scene, upper_front[ufwl - 5], "medium")
    replace_with_window(args.scene, upper_left_front, "medium")

    const upper_back_walls = get_children(upper_walls.back_wall)
    const ubwl = upper_back_walls.length
    replace_with_window(args.scene, upper_back_walls[ubwl - 1], "medium")
    replace_with_window(args.scene, upper_back_walls[ubwl - 2], "medium")
    replace_with_window(args.scene, upper_back_walls[ubwl - 4], "medium")
    replace_with_window(args.scene, upper_back_walls[ubwl - 5], "medium")


    // Small roof covering door

    draw_roof({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(width - 2, HEIGHT_OF_GROUND_FLOOR_FLOOR + HEIGHT_OF_ONE_STORY, 0)),
        width: 2,
        depth: 1,
    })

    // attic

    const height_of_1st_floor_above_ground = HEIGHT_OF_GROUND_FLOOR_FLOOR + HEIGHT_OF_ONE_STORY * 2

    // Floor between 1st floor and attic

    const floor_1st_to_attic_part1 = draw_floor({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(0, 0, -1)),
        width,
        depth: depth - 1,
        y_m: height_of_1st_floor_above_ground + 0.01,
        material: "wooden",
    })

    const floor_1st_to_attic_part2 = draw_floor({
        scene: args.scene,
        parent_node: home,
        position: args.position,
        width: width - 2,
        depth: 1,
        y_m: height_of_1st_floor_above_ground + 0.01,
        material: "wooden",
    })


    // Main roof - larger part

    const slope2_width = 2
    const slope1_width = width - slope2_width
    const slope1_depth = Math.floor(depth / 2)
    const slope2_depth = Math.floor((depth - 1) / 2)

    const main_roof_1 = draw_roof({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(0, height_of_1st_floor_above_ground, 0)),
        width: slope1_width,
        depth: slope1_depth,
        walls: "both"
    })

    const main_roof_2 = draw_roof({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(slope1_width, height_of_1st_floor_above_ground, -depth)),
        width: slope1_width,
        depth: slope1_depth,
        rotation: Math.PI,
        walls: "left"
    })

    const main_roof_ridge = draw_roof_ridge({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(0, height_of_1st_floor_above_ground, -slope1_depth)),
        width: slope1_width,
        y: 3,
    })

    // Main roof - smaller part

    draw_roof({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(slope1_width, height_of_1st_floor_above_ground, -1)),
        width: slope2_width,
        depth: slope2_depth,
        walls: "left",
    })

    draw_roof({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(width, height_of_1st_floor_above_ground, -depth)),
        width: slope2_width,
        depth: slope2_depth,
        walls: "right",
        rotation: Math.PI,
    })


    // Chimney

    draw_chimney({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(-0.01, height_of_1st_floor_above_ground, -slope1_depth)),
        rotation: -Math.PI / 2,
    })


    return {
        home,
        cutthrough_components: [
            foundation_walls.side_right_wall,
            walls.side_right_wall,
            upper_walls.side_right_wall,
            main_roof_1.walls_right,
            main_roof_2.walls_left,
            main_roof_ridge.wall_right,
        ]
    }
}
