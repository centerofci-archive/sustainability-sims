import { DirectionalLight, Scene, ShadowGenerator } from "@babylonjs/core"
import { SUN_NAME } from "../components/create_sun"



export function create_shadow_generator (scene: Scene)
{
    const sun = scene.getLightByName(SUN_NAME)! as DirectionalLight
    const shadow_generator = new ShadowGenerator(1024, sun)
    shadow_generator.usePoissonSampling = true // soft shadows
    shadow_generator.useExponentialShadowMap = false // faster

    return shadow_generator
}
