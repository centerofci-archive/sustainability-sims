import { Scene, ArcRotateCamera, ShadowGenerator, Vector3, Color4 } from "@babylonjs/core"
import { create_earth } from "../components/create_earth"
import { create_forest } from "../components/create_forest"
import { create_gas_bubble } from "../components/create_gas_bubble"
import { create_ground } from "../components/create_ground"
import { create_sky } from "../components/create_sky"
import { WrappedSun } from "../components/create_sun"
import { create_house_scene } from "./create_house_scene"



enum Content
{
    earth,
    forest,
    house,
    gas_bubble,
}
export let content = Content.gas_bubble



export interface CreateContent
{
    (scene: Scene, camera: ArcRotateCamera, sun: WrappedSun, shadow_generator: ShadowGenerator): void
}

export const create_content: CreateContent = (scene, camera, sun, shadow_generator) =>
{
    const ground_size = 40

    if (content === Content.earth)
    {
        sun.configure_for_earth_globe()
        camera.position = new Vector3(170, 170, 170)
        create_earth(scene, camera, sun.sun_point_light)
    }
    else if (content === Content.forest)
    {
        create_sky(scene)
        create_ground(scene, ground_size)
        const { play } = create_forest(scene, shadow_generator, new Vector3(-15, 0, -15), 10)
        play()
    }
    else if (content === Content.house)
    {
        create_house_scene(scene, camera, sun, shadow_generator)
    }
    else if (content === Content.gas_bubble)
    {
        create_sky(scene)
        create_ground(scene, ground_size)
        const { play, hide, grow } = create_gas_bubble(scene, new Vector3(0, 5, 0), 100, new Color4(0.25, 0.3, 0.5, 0.8), shadow_generator)
        play()

        setTimeout(() => grow(30), 1000)
        setTimeout(() => grow(3000, 6000), 5000)
    }
}
