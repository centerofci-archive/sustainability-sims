import {
    Scene,
    ArcRotateCamera,
    PointLight,
    Mesh,
    MeshBuilder,
    StandardMaterial,
    Texture,
} from "@babylonjs/core"
import { AtmosphericScatteringPostProcess } from "../shaders/atmosphericScattering"



export function create_earth (scene: Scene, camera: ArcRotateCamera, sun: PointLight)
{
    const planet_radius = 100
    var earth: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: planet_radius * 2, segments: 75 }, scene)

    camera.setTarget(earth)

    const earth_material = new StandardMaterial("earth_material", scene)
    earth_material.diffuseTexture = new Texture("textures/earth.jpg", scene)
    earth_material.emissiveTexture = new Texture("textures/night2.jpg", scene)
    earth_material.specularTexture = new Texture("textures/specular2.jpg", scene)

    earth.material = earth_material
    earth.rotation.x = Math.PI // textures are always upside down on sphere for some reason...
    earth.rotation.y = Math.PI / 2

    // Move the sphere upward 1/2 its height
    earth.position.y = 1

    // add atmosphere
    const atmosphere_radius = planet_radius * 1.15
    let atmosphere = new AtmosphericScatteringPostProcess("atmosphere", earth, planet_radius, atmosphere_radius, sun, camera, scene)

}
