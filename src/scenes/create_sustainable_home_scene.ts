import { Color4, Vector3 } from "@babylonjs/core"
import { create_ground } from "../components/create_ground"
import { create_house } from "../components/create_house"
import { create_person } from "../components/create_person"
import { create_sky } from "../components/create_sky"
import { create_smoke_plume } from "../components/create_smoke_plume"
import { CreateContentCommonArgs } from "./content"



export const create_sustainable_home_scene = ({ scene, shadow_generator}: CreateContentCommonArgs, ground_size: number) =>
{
    create_sky(scene)
    create_ground(scene, ground_size)
    // const gas = create_gas_bubble(scene, new Vector3(-5, 5, 0), 1, new Color4(0.25, 0.3, 0.5, 0.8), shadow_generator)
    // gas.play()

    create_person(scene, shadow_generator, new Vector3(0, 0, 4))
    create_house(scene, shadow_generator, Vector3.Zero(), "house")

    const { play } = create_smoke_plume(scene, { emit_position1: new Vector3(-0.5, 4.2, -1.9) }, shadow_generator)
    play()



    // setTimeout(() => gas.grow(home1_2021_approx_gas_usage__m3.value), 1000)
}
