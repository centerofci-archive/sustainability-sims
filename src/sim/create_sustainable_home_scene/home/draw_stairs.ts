import { Scene, TransformNode, Vector3 } from "@babylonjs/core"
import { get_mesh } from "../../../utils/get_mesh"



interface DrawStairsArgs
{
    scene: Scene
    parent_node: TransformNode
    position: Vector3
}

export function draw_stairs (args: DrawStairsArgs)
{
    const stairs = get_mesh(args.scene, "stairs_21_25", {
        parent_node: args.parent_node,
        position: args.position,
    })
}
