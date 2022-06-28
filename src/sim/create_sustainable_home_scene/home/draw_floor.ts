import { AbstractMesh, Scene, TransformNode, Vector3 } from "@babylonjs/core"
import { get_mesh } from "../../../utils/get_mesh"
import { vec3 } from "../../../utils/vector"



interface DrawFloorArgs
{
    scene: Scene
    parent_node: TransformNode
    position: Vector3
    width: number
    depth: number
    y_m: number
    material: "wooden" | "concrete"
    fudge?: { x_min?: number, x_max?: number, z_min?: number, z_max?: number }
}

export function draw_floor (args: DrawFloorArgs)
{
    const floor_parent = new TransformNode("floor_parent")
    floor_parent.parent = args.parent_node
    floor_parent.position = args.position.clone()
    const floor = get_mesh(args.scene, `floor_${args.material}`, {
        parent_node: floor_parent,
        position: vec3(0, args.y_m, 0),
    })

    const floor_parts: {[floor_id: string]: AbstractMesh} = {}

    for (let x = 0; x < args.width; ++x)
    {
        const x_fudge = calc_edge_fudge(x, args.width, args.fudge?.x_min, args.fudge?.x_max)

        for (let z = 0; z < args.depth; ++z)
        {
            const z_fudge = calc_edge_fudge(z, args.depth, args.fudge?.z_min, args.fudge?.z_max)

            const floor_part = floor.clone(`floor_${args.material}_${x}_${z}`, floor_parent)!
            floor_part.position.addInPlace(vec3(x - x_fudge.position, 0, -z + z_fudge.position))
            floor_part.scaling = vec3(x_fudge.scale, -1, z_fudge.scale)

            floor_parts[`${x}_${z}`] = floor_part
        }
    }


    floor.dispose()

    return floor_parts
}



const fudge = 0.01
function calc_edge_fudge (int: number, max: number, min_fudge?: number, max_fudge?: number)
{
    min_fudge = min_fudge === undefined ? 1 : min_fudge
    max_fudge = max_fudge === undefined ? 1 : max_fudge

    let position = 0
    let scale = 1
    const at_min = int === 0
    const at_max = int === (max - 1)
    if (at_min) position = (-fudge * min_fudge)
    if (at_max) scale = 1 - ((fudge * max_fudge) + position)

    return { position, scale }
}
