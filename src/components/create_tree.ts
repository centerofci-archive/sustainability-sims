import * as BABYLON from "@babylonjs/core"
import { Vector3 } from "@babylonjs/core"



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



export async function create_tree (scene: BABYLON.Scene, position: Vector3)
{
    const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "public/models/low_poly_tree/", "lowpolytree.obj")
    const tree_green = result.meshes[0]
    const tree_trunk = result.meshes[1]
    tree_green.visibility = 0
    tree_trunk.visibility = 0


    const tree = new BABYLON.Mesh("tree_parent", scene)
    tree.addChild(tree_green)
    tree.addChild(tree_trunk)
    tree.position = position

    

    const grow_tree_anim_group = new BABYLON.AnimationGroup("grow_tree_anim_group")
    grow_tree_anim_group.addTargetedAnimation(grow_tree_y, tree)
    grow_tree_anim_group.addTargetedAnimation(grow_tree_visibility, tree_green)
    grow_tree_anim_group.addTargetedAnimation(grow_tree_visibility, tree_trunk)


    let animated_once = false
    scene.onPointerDown = function (evt, pickResult)
    {
        // if (animated_once) return
        animated_once = true
        grow_tree_anim_group.play()
    }
}
