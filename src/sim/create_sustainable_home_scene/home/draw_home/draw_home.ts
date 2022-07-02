import { AbstractMesh, Scene, Vector3 } from "@babylonjs/core"

import { create_ground } from "../../../../components/create_ground"
import { set_mesh_visiblilty } from "../../../../utils/set_mesh_visiblilty"
import { vec3 } from "../../../../utils/vector"
import { Home } from "../interfaces"
import { DrawSpecificHomeArgs, DrawSpecificHomeReturn } from "./common"
import { draw_detached_home } from "./draw_detached_home"
import { draw_flat_home } from "./draw_flat_home"
import { draw_semidetached_home } from "./draw_semidetached_home"
import { draw_terrace_home } from "./draw_terrace_home"



interface DrawHomeArgs
{
    scene: Scene
    position: Vector3
    home: Home
}

export function draw_home (args: DrawHomeArgs)
{
    let width = 5
    let depth = 7


    const draw_home_args: DrawSpecificHomeArgs = { ...args, width, depth }
    let home_render_result: DrawSpecificHomeReturn
    if (args.home.type === "semidetached")
    {
        home_render_result = draw_semidetached_home(draw_home_args)
    }
    else if (args.home.type === "terrace")
    {
        home_render_result = draw_terrace_home(draw_home_args)
    }
    else if (args.home.type === "detached")
    {
        home_render_result = draw_detached_home(draw_home_args)
    }
    else if (args.home.type === "flat")
    {
        home_render_result = draw_flat_home(draw_home_args)
    }
    else
    {
        console.error(`Unsupported home type: "${args.home.type}"`)
        home_render_result = { home: new AbstractMesh(""), cutthrough_components: [] }
    }


    const ground_position = args.position.add(vec3((width / 2), 0, (-depth / 2)))
    const ground_size = Math.max(width, depth, home_render_result.ground_width || 0) + 6
    const ground = create_ground(args.scene, ground_size, ground_position)


    ;(window as any).hide_wall = () =>
    {
        const target_vis = 0 //0.05
        let vis = 1
        let timer_id = -1
        timer_id = setInterval(() =>
        {
            vis -= 0.05
            home_render_result.cutthrough_components.forEach(value =>
            {
                if (!value) return
                set_mesh_visiblilty(value, vis)
            })

            if (vis <= target_vis) clearTimeout(timer_id)
        }, 30)
    }


    return home_render_result.home
}
