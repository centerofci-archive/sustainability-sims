import { AbstractMesh, Node, TransformNode, Scene, Vector3, Nullable } from "@babylonjs/core"

import { get_mesh } from "../../../utils/get_mesh"
import { vec3 } from "../../../utils/vector"



interface DrawWallArgs
{
    scene: Scene
    parent_node: Nullable<Node>
    position: Vector3
    width: number
    depth: number
}

export function draw_walls (args: DrawWallArgs)
{
    const front_wall_parent = new TransformNode("front_wall_parent")
    front_wall_parent.parent = args.parent_node
    front_wall_parent.position = args.position.clone()
    const wall = get_mesh(args.scene, "wall", {
        parent_node: front_wall_parent,
        // Have to offset the wall by 1 in x direction due to strange rotation and scaling on import
        // https://forum.babylonjs.com/t/setparent-null-versus-parent-null-of-model-to-remove-mirroring-inverse-scaling/31525
        position: vec3([0, 0, 0]),
    })
    draw_wall(wall, args.width)

    const back_wall_parent = new TransformNode("back_wall_parent")
    back_wall_parent.parent = args.parent_node
    back_wall_parent.rotation = vec3([0, Math.PI, 0])
    back_wall_parent.position = args.position.add(vec3([args.width, 0, -args.depth]))
    const back_wall = wall.clone("back_wall", back_wall_parent)!
    draw_wall(back_wall, args.width)

    const side_left_wall_parent = new TransformNode("side_left_wall_parent")
    side_left_wall_parent.parent = args.parent_node
    side_left_wall_parent.rotation = vec3([0, Math.PI / 2, 0])
    side_left_wall_parent.position = args.position.clone().add(vec3([args.width, 0, 0]))
    const side_left_wall = wall.clone("side_left_wall", side_left_wall_parent)!
    draw_wall(side_left_wall, args.depth)

    const side_right_wall_parent = new TransformNode("side_right_wall_parent")
    side_right_wall_parent.parent = args.parent_node
    side_right_wall_parent.rotation = vec3([0, -Math.PI / 2, 0])
    side_right_wall_parent.position = args.position.add(vec3([0, 0, -args.depth]))
    const side_right_wall = wall.clone("side_right_wall", side_right_wall_parent)!
    draw_wall(side_right_wall, args.depth)

    return {
        front_wall: front_wall_parent,
        back_wall: back_wall_parent,
        side_left_wall: side_left_wall_parent,
        side_right_wall: side_right_wall_parent,
    }
}



function draw_wall (wall: AbstractMesh, size: number)
{
    let a = 1
    while (a < size)
    {
        const wall_clone = wall.clone(wall.name + a, wall.parent)!
        wall_clone.position.addInPlace(vec3([a, 0, 0]))
        a += 1
    }

    return wall
}
