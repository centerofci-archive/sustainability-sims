import { AbstractMesh, Color3, Material, StandardMaterial } from "@babylonjs/core"
import { grey_out } from "../../../../3d_models/grey_out"

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



const height_of_1st_floor_above_ground = HEIGHT_OF_GROUND_FLOOR_FLOOR + HEIGHT_OF_ONE_STORY * 2



export function draw_terrace_home (args: DrawSpecificHomeArgs): DrawSpecificHomeReturn
{
    const homes_container = new AbstractMesh("homes_container")

    const main_home = draw_single_terrace_home(args, homes_container)
    // Neighbours
    const neighbour_home_left = draw_single_simple_terrace_home({
        ...args,
        position: args.position.add(vec3(args.width, 0, 0)),
    }, homes_container)
    const neighbour_home_right = draw_single_simple_terrace_home({
        ...args,
        position: args.position.add(vec3(-args.width, 0, 0)),
    }, homes_container)

    grey_out(neighbour_home_left.home)
    grey_out(neighbour_home_right.home)

    return {
        home: homes_container,
        cutthrough_components: [
            ...main_home.cutthrough_components,
            neighbour_home_right.home,
        ],
        ground_width: args.width * 3,
    }
}



function draw_single_terrace_home (args: DrawSpecificHomeArgs, homes_container: AbstractMesh)
{
    const { home, cutthrough_components } = draw_single_simple_terrace_home(args, homes_container)

    const { width, depth } = args

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


    // attic

    // Floor between 1st floor and attic
    const floor_1st_to_attic = draw_floor({
        scene: args.scene,
        parent_node: home,
        position: args.position.clone(),
        width,
        depth,
        y_m: height_of_1st_floor_above_ground + 0.01,
        material: "wooden",
    })


    return {
        home,
        cutthrough_components,
    }
}




function draw_single_simple_terrace_home (args: DrawSpecificHomeArgs, homes_container: AbstractMesh)
{
    const { width, depth } = args

    const home = new AbstractMesh("home")
    home.parent = homes_container

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



    const upper_walls = draw_walls({
        scene: args.scene,
        parent_node: home,
        position: args.position,
        width,
        depth,
        y_m: HEIGHT_OF_GROUND_FLOOR_FLOOR + HEIGHT_OF_ONE_STORY,
    })


    // Upper floor windows
    const upper_front_walls = get_children(upper_walls.front_wall)
    const ufwl = upper_front_walls.length
    replace_with_window(args.scene, upper_front_walls[ufwl - 1], "medium")
    replace_with_window(args.scene, upper_front_walls[ufwl - 2], "medium")
    replace_with_window(args.scene, upper_front_walls[ufwl - 4], "medium")
    replace_with_window(args.scene, upper_front_walls[ufwl - 5], "medium")

    const upper_back_walls = get_children(upper_walls.back_wall)
    const ubwl = upper_back_walls.length
    replace_with_window(args.scene, upper_back_walls[ubwl - 1], "medium")
    replace_with_window(args.scene, upper_back_walls[ubwl - 2], "medium")
    replace_with_window(args.scene, upper_back_walls[ubwl - 4], "medium")
    replace_with_window(args.scene, upper_back_walls[ubwl - 5], "medium")


    // attic

    // Main roof
    const slope1_depth = Math.floor(depth / 2)

    const main_roof_1 = draw_roof({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(0, height_of_1st_floor_above_ground, 0)),
        width,
        depth: slope1_depth,
        walls: "both"
    })

    const main_roof_2 = draw_roof({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(width, height_of_1st_floor_above_ground, -depth)),
        width,
        depth: slope1_depth,
        rotation: Math.PI,
        walls: "both"
    })

    const main_roof_ridge = draw_roof_ridge({
        scene: args.scene,
        parent_node: home,
        position: args.position.add(vec3(0, height_of_1st_floor_above_ground, -slope1_depth)),
        width,
        y: 3,
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
