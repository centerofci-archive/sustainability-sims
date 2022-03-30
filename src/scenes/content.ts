import { Scene, ArcRotateCamera, ShadowGenerator, Vector3, Color4, StandardMaterial } from "@babylonjs/core"

import { create_arrow } from "../components/create_arrow"
import { create_earth } from "../components/create_earth"
import { create_forest } from "../components/create_forest"
import { create_gas_bubble } from "../components/create_gas_bubble"
import { create_ground } from "../components/create_ground"
import { create_sky } from "../components/create_sky"
import { WrappedSun } from "../components/create_sun"
import { create_arrow_scene } from "./create_arrow_scene"
import { create_compare_home_gas_usage_scene } from "./create_compare_home_gas_usage_scene"
import { create_house_scene } from "./create_house_scene"
import { create_sustainable_home_scene } from "./create_sustainable_home_scene"



enum Content
{
    earth,
    forest,
    house,
    gas_bubble,
    arrow,
    compare_home_gas_usage,
    sustainable_home,
}
export let content = Content.arrow



export interface CreateContentCommonArgs
{
    scene: Scene
    camera: ArcRotateCamera
    sun: WrappedSun
    shadow_generator: ShadowGenerator
}

export const create_content = ({ scene, camera, sun, shadow_generator }: CreateContentCommonArgs) =>
{
    const small_ground_size = 40

    if (content === Content.earth)
    {
        sun.configure_for_earth_globe()
        camera.position = new Vector3(170, 170, 170)
        create_earth(scene, camera, sun.sun_point_light)
    }
    else if (content === Content.forest)
    {
        create_sky(scene)
        create_ground(scene, small_ground_size)
        const { play } = create_forest(scene, shadow_generator, new Vector3(-15, 0, -15), 10)
        play()
    }
    else if (content === Content.house)
    {
        create_house_scene({ scene, camera, sun, shadow_generator }, small_ground_size)
    }
    else if (content === Content.gas_bubble)
    {
        create_sky(scene)
        create_ground(scene, small_ground_size)
        const { play, opacity, grow } = create_gas_bubble(scene, new Vector3(0, 5, 0), 100, new Color4(0.25, 0.3, 0.5, 0.8), shadow_generator)
        play()

        setTimeout(() => grow(30), 1000)
        setTimeout(() => grow(3000, 6000), 5000)
        setTimeout(() => opacity(0.1), 1000)
        setTimeout(() => opacity(1), 3000)
    }
    else if (content === Content.arrow)
    {
        create_arrow_scene({ scene, camera, sun, shadow_generator }, small_ground_size)
    }
    else if (content === Content.compare_home_gas_usage)
    {
        create_compare_home_gas_usage_scene({ scene, camera, sun, shadow_generator }, small_ground_size)
    }
    else if (content === Content.sustainable_home)
    {
        create_sustainable_home_scene({ scene, camera, sun, shadow_generator }, small_ground_size)
    }
}
