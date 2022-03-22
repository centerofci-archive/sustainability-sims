import * as BABYLON from "@babylonjs/core"
import { Vector3 } from "@babylonjs/core"
import { get_mesh } from "../utils/get_mesh"



// TODO: rename this mesh from 'low_poly_tree_1' to 'low_poly_tree_1_green'
export const mesh_name_low_poly_tree_1_green = "low_poly_tree_1"
// TODO: rename this mesh from 'mesh_mm1' to 'low_poly_tree_1_trunk'
export const mesh_name_low_poly_tree_1_trunk = "mesh_mm1"


const frame_rate = 10


const grow_tree_y = new BABYLON.Animation("grow_tree_y", "position.y",
    frame_rate,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
)

// Creating an easing function
const easing_function = new BABYLON.ExponentialEase()
easing_function.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT)
grow_tree_y.setEasingFunction(easing_function)


grow_tree_y.setKeys([
    { frame: 0, value: -5, },
    { frame: frame_rate, value: 0, },
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
    node: BABYLON.Node
}

export function create_tree (scene: BABYLON.Scene, position: Vector3, name: string): Tree
{
    const tree = new BABYLON.TransformNode("tree_parent_" + name)

    const tree_green = get_mesh(scene, mesh_name_low_poly_tree_1_green, "tree_green_" + name, tree)
    const tree_trunk = get_mesh(scene, mesh_name_low_poly_tree_1_trunk, "tree_trunk_" + name, tree)

    // Allow trees to be shadowed
    tree_green.receiveShadows = true
    tree_trunk.receiveShadows = true

    tree.position = position


    const grow_tree_anim_group = new BABYLON.AnimationGroup("grow_tree_anim_group")
    grow_tree_anim_group.addTargetedAnimation(grow_tree_y, tree)
    grow_tree_anim_group.addTargetedAnimation(grow_tree_visibility, tree_green)
    grow_tree_anim_group.addTargetedAnimation(grow_tree_visibility, tree_trunk)


    return {
        play: () => grow_tree_anim_group.play(),
        node: tree,
    }
}
