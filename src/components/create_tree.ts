import * as BABYLON from "@babylonjs/core"
import { Vector3 } from "@babylonjs/core"
import { get_mesh } from "./get_mesh"



const frame_rate = 10


const grow_tree_y = new BABYLON.Animation("grow_tree_y", "position.y",
    frame_rate,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
)

grow_tree_y.setKeys([
    { frame: 0, value: -3.3, },
    { frame: frame_rate, value: 2, },
])


const grow_tree_visibility = new BABYLON.Animation("grow_tree_visibility", "visibility",
    frame_rate,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
)

grow_tree_visibility.setKeys([
    { frame: 0, value: 0, },
    { frame: 1, value: 1, },
])



export interface Tree
{
    play: () => void
}

export function create_tree (scene: BABYLON.Scene, position: Vector3, name: string = ""): Tree
{
    const tree = new BABYLON.Mesh("tree_parent_" + name, scene)

    const tree_green = get_mesh(scene, "low_poly_tree_1", "tree_green_" + name, tree)
    // TODO: rename this mesh from 'mesh_mm1' to 'low_poly_tree_trunk_1'
    const tree_trunk = get_mesh(scene, "mesh_mm1", "tree_trunk_" + name, tree)

    tree_green.visibility = 0
    tree_trunk.visibility = 0

    tree.position = position

    
    const grow_tree_anim_group = new BABYLON.AnimationGroup("grow_tree_anim_group")
    grow_tree_anim_group.addTargetedAnimation(grow_tree_y, tree)
    // grow_tree_anim_group.addTargetedAnimation(grow_tree_visibility, tree_green)
    // grow_tree_anim_group.addTargetedAnimation(grow_tree_visibility, tree_trunk)


    return {
        play: () => grow_tree_anim_group.play()
    }
}
