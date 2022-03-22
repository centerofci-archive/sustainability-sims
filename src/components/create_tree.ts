import * as BABYLON from "@babylonjs/core"
import { ShadowGenerator, Vector3 } from "@babylonjs/core"
import { get_mesh } from "../utils/get_mesh"



export const mesh_name_low_poly_tree_1 = "low_poly_tree_1"


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

export function create_tree (scene: BABYLON.Scene, shadow_generator: ShadowGenerator, position: Vector3, name: string): Tree
{
    const tree = get_mesh(scene, mesh_name_low_poly_tree_1, "tree_green_" + name, { position, receive_shadows: true, shadow_generator })


    const grow_tree_anim_group = new BABYLON.AnimationGroup("grow_tree_anim_group")
    grow_tree_anim_group.addTargetedAnimation(grow_tree_y, tree)

    tree.getChildMeshes().forEach(mesh =>
    {
        grow_tree_anim_group.addTargetedAnimation(grow_tree_visibility, mesh)
    })


    return {
        play: () => grow_tree_anim_group.play(),
        node: tree,
    }
}
