import { Vector3 } from "@babylonjs/core"
import { create_forest } from "../components/create_forest"
import { create_ground } from "../components/create_ground"
import { create_ground_mist, Density } from "../components/create_ground_mist"
import { create_house } from "../components/create_house"
import { create_sky } from "../components/create_sky"
import { CreateContent } from "./content"



export const create_house_scene: CreateContent = (scene, camera, sun, shadow_generator) =>
{
    const ground_size = 40

    create_sky(scene)
    create_ground(scene, ground_size)
    create_house(scene, shadow_generator, new Vector3(0, 0, 0), "house_one")


    const { tree_nodes: trees, play: grow_forest } = create_forest(scene, shadow_generator, new Vector3(-15, 0, -15), 10)

    // remove trees near house
    const near = 4
    trees.filter(tree =>
    {
        if (tree.position.x > -near && tree.position.x < near && tree.position.z > -near && tree.position.z < near)
        {
            tree.dispose()
        }
    })

    // animate
    let animated_once = false
    scene.onPointerDown = () =>
    {
        if (animated_once) return
        animated_once = true

        grow_forest()
        create_ground_mist(scene, ground_size * 0.45, Density.mediumlight)
    }
}
