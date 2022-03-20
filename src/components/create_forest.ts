import * as BABYLON from "@babylonjs/core"
import { ShadowGenerator, Vector3 } from "@babylonjs/core"
import { create_tree, Tree } from "./create_tree"



export function create_forest (scene: BABYLON.Scene, shadow_generator: ShadowGenerator, position: Vector3, size: number)
{
    const tree_nodes: BABYLON.Node[] = []
    const trees_with_delays: { tree: Tree, delay: number }[] = []

    const total_animation_time = 10

    let i = 0
    while (i < size)
    {
        let j = 0
        while (j < size)
        {
            const x = (i * 3) + (Math.random() * 2)
            const z = (j * 3) + (Math.random() * 2)
            const pos = position.add(new Vector3(x, 0, z))
            const tree = create_tree(scene, pos, `${i}_${j}`)
            tree_nodes.push(tree.node)

            const progress = 1 - ((i + j) / (size * 2))
            const d = Math.sin(progress * (Math.PI / 2)) * total_animation_time
            const delay = (d + Math.random() * 3) * 300
            trees_with_delays.push({ tree, delay })
            ++j
        }
        ++i
    }


    let animated_once = false
    scene.onPointerDown = function (evt, pickResult)
    {
        if (animated_once) return
        animated_once = true
        trees_with_delays.forEach(({ tree, delay }) =>
        {
            setTimeout(() => tree.play(), delay)
        })
    }


    // Add shadows for trees
    tree_nodes.forEach(tree =>
    {
        tree.getChildMeshes().forEach(child_mesh =>
        {
            shadow_generator.addShadowCaster(child_mesh)
        })
    })


    return tree_nodes
}
