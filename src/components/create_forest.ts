import { AbstractMesh, Matrix, MeshBuilder, Scene, ShadowGenerator, Vector3, Vector4 } from "@babylonjs/core"
import { set_mesh_visiblilty } from "../utils/set_mesh_visiblilty"
import { vec3 } from "../utils/vector"
import { create_tree, Tree } from "./create_tree"



export function create_forest (scene: Scene, shadow_generator: ShadowGenerator, position: Vector3, size: number)
{
    const tree_nodes: (AbstractMesh & { size: number })[] = []
    const trees_with_delays: { tree: Tree, delay: number }[] = []

    const space_between_tree_centers = 3
    const growth_direction_near_to_far = true


    const tree = create_tree(scene, shadow_generator, vec3([0,0,0]), `thin_tree`)
    tree.node.getChildMeshes()[0].isVisible = false
    tree.node.getChildMeshes()[1].isVisible = false
    // const tree = MeshBuilder.CreateBox("root", {size: 1})

    const instance_count_1d = Math.round(size / space_between_tree_centers)
    // const instance_count_2d = instance_count_1d ** 2
    // const matrices_data = new Float32Array(16 * instance_count_2d)


    let m = Matrix.Identity()
    let index = 0
    let i = 0
    while (i < instance_count_1d)
    {
        let j = 0
        while (j < instance_count_1d)
        {
            const x = (i * -1 * space_between_tree_centers) - (Math.random() * 2)
            const z = (j * -1 * space_between_tree_centers) - (Math.random() * 2)

            const s = 0.5 + (Math.sin(Math.random() * Math.PI) * 0.7)

            const tree_leaves_instance = (tree.node.getChildMeshes()[0] as any).createInstance(`tree_leaves_${i}_${j}`)
            const tree_trunk_instance = (tree.node.getChildMeshes()[1] as any).createInstance(`tree_trunk_${i}_${j}`)

            shadow_generator.addShadowCaster(tree_leaves_instance)
            shadow_generator.addShadowCaster(tree_trunk_instance)

            tree_leaves_instance.scaling = vec3([s, s, s])
            tree_leaves_instance.position.x = x
            tree_leaves_instance.position.z = z
            tree_trunk_instance.scaling = vec3([s, s, s])
            tree_trunk_instance.position.x = x
            tree_trunk_instance.position.z = z
            // set_mesh_visiblilty(tree_leaves_instance, 1)

            // const pos = position.add(new Vector3(x, 0, z))
            // const tree = create_tree(scene, shadow_generator, pos, `${i}_${j}`)

            // tree.node.getChildMeshes().forEach(mesh => mesh.scaling = scale)
            // const tree_node: any = tree.node
            // tree_node.size = s
            tree_nodes.push(tree_leaves_instance)
            tree_nodes.push(tree_trunk_instance)

            const progress = (i + j) / ((size - 1) * 2)
            const inv_progress = 1 - progress
            const p = growth_direction_near_to_far ? progress : inv_progress
            const d = Math.sin(p * (Math.PI / 2))
            const delay = (d * 10 + Math.random() * p) * 200

            trees_with_delays.push({ tree: tree_leaves_instance, delay })
            trees_with_delays.push({ tree: tree_trunk_instance, delay })
            ++j
            ++index
        }
        ++i
    }

    // ;(tree.node.getChildMeshes()[0] as any).thinInstanceSetBuffer("matrix", matrices_data, 16)
    // tree.node..thinInstanceSetBuffer("color", colorData, 4);


    function play ()
    {
        tree.play()
        trees_with_delays.forEach(({ tree, delay }) =>
        {
            setTimeout(() => tree.play(), delay)
        })
    }


    return {
        tree_nodes,
        play,
    }
}
