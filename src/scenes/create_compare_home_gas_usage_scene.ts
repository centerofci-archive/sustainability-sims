import { Color3, Color4, HighlightLayer, PointerEventTypes, Vector3 } from "@babylonjs/core"
import { create_gas_bubble } from "../components/create_gas_bubble"
import { create_ground } from "../components/create_ground"
import { create_person } from "../components/create_person"
import { create_sky } from "../components/create_sky"
import { home1_2021_approx_gas_usage__m3__perspectives } from "../data/home_energy/home1"
import { home2_annual_gas_usage__m3 } from "../data/home_energy/home2"
import { CreateContentCommonArgs } from "./content"



export const create_compare_home_gas_usage_scene = ({ scene, shadow_generator }: CreateContentCommonArgs, ground_size: number) =>
{
    create_sky(scene)
    create_ground(scene, ground_size)
    const gas1 = create_gas_bubble(scene, { position: new Vector3(-7, 0, 0), volume_m3: 1, color: new Color4(0.25, 0.3, 0.5, 0.8), shadow_generator, animation: "ripple" })
    gas1.play()
    const gas2 = create_gas_bubble(scene, { position: new Vector3(7, 0, 0), volume_m3: 1, color: new Color4(0.25, 0.3, 0.5, 0.8), shadow_generator, animation: "bounce", bounce_animation_squidge: 0.01 })
    gas2.play()


    gas1.gas_bubble_mesh.enablePointerMoveEvents = true
    gas2.gas_bubble_mesh.enablePointerMoveEvents = true
    const highlight = new HighlightLayer("hl1", scene)
    highlight.outerGlow = false // prevents this problem: https://forum.babylonjs.com/t/large-highligh-of-mesh-behind-partly-visible-mesh/28913


    create_person(scene, shadow_generator, new Vector3(0, 0, 6))

    setTimeout(() => gas1.grow(home1_2021_approx_gas_usage__m3__perspectives[0].value), 1000)
    setTimeout(() => gas2.grow(home2_annual_gas_usage__m3.second_estimate_for_2022.value), 1000)



    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === PointerEventTypes.POINTERDOWN)
        {
            // if (pointerInfo.pickInfo?.hit && pointerInfo.pickInfo.pickedMesh !== ground) {
            //     pointerDown(pointerInfo.pickInfo.pickedMesh)
            // }
        }
        else if (pointerInfo.type === PointerEventTypes.POINTERMOVE)
        {
            if (pointerInfo.pickInfo?.pickedMesh === gas1.gas_bubble_mesh)
            {
                highlight.addMesh(gas1.gas_bubble_mesh, Color3.Green())
            }
            else
            {
                highlight.removeMesh(gas1.gas_bubble_mesh)
            }

            if (pointerInfo.pickInfo?.pickedMesh === gas2.gas_bubble_mesh)
            {
                highlight.addMesh(gas2.gas_bubble_mesh, Color3.Green())
            }
            else
            {
                highlight.removeMesh(gas2.gas_bubble_mesh)
            }
        }
    })
}
