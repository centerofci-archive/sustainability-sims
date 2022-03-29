import { Color4, Vector3 } from "@babylonjs/core"
import { create_gas_bubble } from "../components/create_gas_bubble"
import { create_ground } from "../components/create_ground"
import { create_person } from "../components/create_person"
import { create_sky } from "../components/create_sky"
import { home1_2021_approx_gas_usage__m3 } from "../data/home_energy/home1"
import { home2_annual_2019_gas_usage__m3 } from "../data/home_energy/home2"
import { CreateContentCommonArgs } from "./content"



export const create_compare_home_gas_usage_scene = ({ scene, shadow_generator }: CreateContentCommonArgs, ground_size: number) =>
{
    create_sky(scene)
    create_ground(scene, ground_size)
    const gas1 = create_gas_bubble(scene, new Vector3(-5, 5, 0), 1, new Color4(0.25, 0.3, 0.5, 0.8), shadow_generator)
    gas1.play()
    const gas2 = create_gas_bubble(scene, new Vector3(5, 5, 0), 1, new Color4(0.25, 0.3, 0.5, 0.8), shadow_generator)
    gas2.play()

    create_person(scene, shadow_generator, new Vector3(0, 0, 0))

    setTimeout(() => gas1.grow(home1_2021_approx_gas_usage__m3.value), 1000)
    setTimeout(() => gas2.grow(home2_annual_2019_gas_usage__m3.value), 1000)
}
