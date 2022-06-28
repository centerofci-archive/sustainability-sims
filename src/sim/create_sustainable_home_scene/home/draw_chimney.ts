import { Scene, TransformNode, Vector3 } from "@babylonjs/core"
import { get_mesh } from "../../../utils/get_mesh"
import { vec3 } from "../../../utils/vector"



interface DrawChimneyArgs
{
    scene: Scene
    parent_node: TransformNode
    position: Vector3
    rotation?: number
}

export function draw_chimney (args: DrawChimneyArgs)
{
    const chimney = get_mesh(args.scene, "chimney_tall")
    chimney.parent = args.parent_node
    chimney.position = args.position

    if (args.rotation) chimney.rotation = vec3(0, args.rotation, 0)
}
