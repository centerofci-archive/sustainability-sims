import { AbstractMesh, Animation, Color4, EasingFunction, SineEase, Vector3 } from "@babylonjs/core"
import { create_arrow } from "../components/create_arrow"
import { create_arrow_chain } from "../components/create_arrow_chain"
import { create_ground } from "../components/create_ground"
import { create_sky } from "../components/create_sky"
import { CreateContentCommonArgs } from "./content"



export const create_arrow_scene = ({ scene, shadow_generator }: CreateContentCommonArgs, ground_size: number) =>
{
    create_sky(scene)
    create_ground(scene, ground_size)

    // Fixed arrow
    create_arrow(scene, "", { position: [0, 3, -3], volume_m3: 2.33, color: new Color4(0.25, 0.3, 0.5, 0.8), rotation: [1, 1, 1] })


    // Flashing arrow
    const arrow_dull = create_arrow(scene, "", { position: [0, 3, 0], volume_m3: 2.33, color: new Color4(0.25, 0.3, 0.5, 0.8), hard: false, glow: 0.00 })
    const arrow_glow = create_arrow(scene, "", { position: [0, 3, 0], volume_m3: 2.33, color: new Color4(0.5, 0.2, 0.15, 0.8), hard: false, glow: 0.06 })

    let bright_glow_color = true
    setInterval(() =>
    {
        arrow_dull.visibility = bright_glow_color ? 0.8 : 0
        arrow_glow.visibility = bright_glow_color ? 0 : 0.8
        bright_glow_color = !bright_glow_color
    }, 1000)


    // Arrow chain
    const { play } = create_arrow_chain(scene, "CO2_absorbed", {
        position: [0, 8, 3],
        color: new Color4(0.3, 0.5, 0.25, 0.8),
        rotation: [Math.PI, 0, 0],
    }, { distance: 8, number_of_arrows: 2 })
    play()

    create_arrow_chain(scene, "CO2_absorbed", {
        position: [-3, 5, 3],
        color: new Color4(0.3, 0.5, 0.25, 0.8),
        rotation: [Math.PI, 0, 0],
        volume_m3: 1,
    }, { distance: 5, number_of_arrows: 3 }).play()

}
