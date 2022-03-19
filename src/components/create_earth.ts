import * as BABYLON from "@babylonjs/core"
import { AtmosphericScatteringPostProcess } from "../shaders/atmosphericScattering"



export function create_earth (scene: BABYLON.Scene, camera: BABYLON.ArcRotateCamera, sun: BABYLON.PointLight)
{
    const planetRadius = 100
    var earth: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: planetRadius * 2, segments: 75 }, scene)

    camera.setTarget(earth)
    
    let earthMaterial = new BABYLON.StandardMaterial("earthMaterial", scene)
    earthMaterial.diffuseTexture = new BABYLON.Texture("./public/textures/earth.jpg", scene)
    earthMaterial.emissiveTexture = new BABYLON.Texture("./public/textures/night2.jpg", scene)
    earthMaterial.specularTexture = new BABYLON.Texture("./public/textures/specular2.jpg", scene)

    earth.material = earthMaterial
    earth.rotation.x = Math.PI // textures are always upside down on sphere for some reason...
    earth.rotation.y = Math.PI / 2
    
    // Move the sphere upward 1/2 its height
    earth.position.y = 1

    // add atmosphere
    const atmosphereRadius = planetRadius * 1.15
    let atmosphere = new AtmosphericScatteringPostProcess("atmosphere", earth, planetRadius, atmosphereRadius, sun, camera, scene)    
}
