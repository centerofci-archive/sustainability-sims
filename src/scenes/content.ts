import { Scene, ArcRotateCamera, ShadowGenerator, Vector3, Color4, StandardMaterial } from "@babylonjs/core"
import { AdvancedDynamicTexture } from "@babylonjs/gui"

import { create_arrow } from "../components/create_arrow"
import { create_earth } from "../components/create_earth"
import { create_forest } from "../components/create_forest"
import { create_gas_bubble } from "../components/create_gas_bubble"
import { create_ground } from "../components/create_ground"
import { create_sky } from "../components/create_sky"
import { WrappedSun } from "../components/create_sun"
import { bounded } from "../utils/bounded"
import { url_params_parser } from "../utils/url_params_parser"
import { create_arrow_scene } from "./create_arrow_scene"
import { create_compare_home_gas_usage_scene } from "./create_compare_home_gas_usage_scene"
import { create_house_scene } from "./create_house_scene"
import { create_sustainable_home_scene } from "./create_sustainable_home_scene/create_sustainable_home_scene"
import { create_sustainable_home_scene_v2 } from "./create_sustainable_home_scene/create_sustainable_home_scene_v2"



enum Content
{
    nada,
    basic,
    earth,
    forest,
    house,
    gas_bubble,
    arrow,
    compare_home_gas_usage,
    sustainable_home,
    sustainable_home_v2,
}

const url_params = url_params_parser()
let content = Content.sustainable_home_v2



export interface CreateContentCommonArgs
{
    scene: Scene
    camera: ArcRotateCamera
    sun: WrappedSun
    shadow_generator: ShadowGenerator
    ui_layer: AdvancedDynamicTexture
}

export const create_content = ({ scene, camera, sun, shadow_generator }: CreateContentCommonArgs) =>
{
    camera.upperBetaLimit = (Math.PI / 2) * 0.99

    const small_ground_size = 40
    const tiny_ground_size = 20

    const ui_layer = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene)

    if (content === Content.basic)
    {
        // sun.set_intensity(0)
        // const { skybox, skybox_material, set_sky_config } = create_sky(scene)
        create_sky(scene)
        create_ground(scene, small_ground_size)

        // let new_inclination_direction = 1
        // let new_inclination = 0
        // setInterval(() =>
        // {

        //     new_inclination += (0.1 * new_inclination_direction)
        //     new_inclination = bounded(new_inclination, 0, 1)
        //     if (new_inclination >= 0.6) new_inclination_direction = -1
        //     else if (new_inclination <= 0.2) new_inclination_direction = 1
        //     set_sky_config("material.inclination", skybox_material.inclination, new_inclination)
        //     // skybox.rotation = new Vector3(skybox.rotation.x + 0.1, 0, 0)
        // }, 1000)


    }
    else if (content === Content.earth)
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
        create_house_scene({ scene, camera, sun, shadow_generator, ui_layer }, small_ground_size)
    }
    else if (content === Content.gas_bubble)
    {
        create_sky(scene)
        create_ground(scene, small_ground_size)
        const { play, opacity, grow } = create_gas_bubble(scene, { position: new Vector3(-5, 0, 0), volume_m3: 100, color: new Color4(0.25, 0.3, 0.5, 0.8), shadow_generator, animation: "bounce" })
        play()

        const gas2 = create_gas_bubble(scene, { position: new Vector3(5, 0, 0), volume_m3: 100, color: new Color4(0.25, 0.3, 0.5, 0.8), shadow_generator, animation: "ripple" })
        gas2.play()

        setTimeout(() => { grow(30); gas2.grow(30) }, 1000)
        setTimeout(() => { grow(100, 4000); gas2.grow(100, 4000) }, 3000)
        setTimeout(() => { opacity(0.1); gas2.opacity(0.1) }, 1000)
        setTimeout(() => { opacity(1); gas2.opacity(1) }, 3000)
    }
    else if (content === Content.arrow)
    {
        create_arrow_scene({ scene, camera, sun, shadow_generator, ui_layer }, small_ground_size)
    }
    else if (content === Content.compare_home_gas_usage)
    {
        create_compare_home_gas_usage_scene({ scene, camera, sun, shadow_generator, ui_layer }, small_ground_size)
    }
    else if (content === Content.sustainable_home)
    {
        create_sustainable_home_scene({ scene, camera, sun, shadow_generator, ui_layer }, tiny_ground_size, url_params)
    }
    else if (content === Content.sustainable_home_v2)
    {
        create_sustainable_home_scene_v2({ scene, camera, sun, shadow_generator, ui_layer }, tiny_ground_size, url_params)
    }
}
