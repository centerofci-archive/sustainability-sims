import {
    Color3,
    GlowLayer,
    HemisphericLight,
    MeshBuilder,
    PointLight,
    Scene,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core"



export const SUN_NAME = "sun_direct"

export interface WrappedSun
{
    set_intensity: (intensity: number) => void
    configure_for_earth_globe: () => void
    sun_point_light: PointLight
}
export function create_sun (scene: Scene): WrappedSun
{
    const position = new Vector3(50, 20, 20)

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const sun_direction = new Vector3(0, 0, 0)
    const sun = new PointLight(SUN_NAME, sun_direction, scene)
    sun.position = position
    const sky = new HemisphericLight("sun_indirect", sun_direction, scene)

    const sun_globe = make_sun_globe(scene, position)

    // sky.position = new Vector3(500, 200, 0)

    return {
        set_intensity: (intensity: number) =>
        {
            sun.intensity = intensity
            sky.intensity = intensity
        },
        configure_for_earth_globe: () =>
        {
            sky.dispose()
            sun_globe.scaling = new Vector3(10, 10, 10)

            const position = new Vector3(500, 200, 200)
            sun_globe.position = position
            sun.position = position
            sun.intensity = 1
        },
        sun_point_light: sun,
    }
}



function make_sun_globe (scene: Scene, position: Vector3)
{
    const sun_globe = MeshBuilder.CreateSphere("sun_sphere", { diameter: 1 }, scene)
    sun_globe.position = position

    const sun_glow_material = new StandardMaterial("sun_glow_material", scene)
    sun_glow_material.emissiveColor = new Color3(1, 1, 0.5)

    sun_globe.material = sun_glow_material
    const sun_globe_glow = new GlowLayer("glow", scene)
    sun_globe_glow.intensity = 10

    return sun_globe
}
