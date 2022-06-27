import { AbstractMesh, Scene, TransformNode, Vector3 } from "@babylonjs/core"
import { get_mesh } from "../../../utils/get_mesh"
import { vec3 } from "../../../utils/vector"



interface DrawFloorArgs
{
    scene: Scene
    parent_node: AbstractMesh
    position: Vector3
    width: number
    depth: number
    y_m: number
    material: "wooden" | "concrete"
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

    for (let x = 0; x < args.width; ++x)
    {
        const x_edge_fudge = calc_edge_fudge(x, args.width)

        for (let z = 0; z < args.depth; ++z)
        {
            const z_edge_fudge = calc_edge_fudge(z, args.depth)

            const floor_part = floor.clone(`floor_${args.material}_${x}_${z}`, floor_parent)!
            floor_part.position.addInPlace(vec3(x - x_edge_fudge, 0, -z + z_edge_fudge))
        }
    }


    floor.dispose()
}



const fudge = 0.01
function calc_edge_fudge (int: number, max: number)
{
    return int === 0 ? -fudge : (int === (max - 1) ? fudge : 0)
}
