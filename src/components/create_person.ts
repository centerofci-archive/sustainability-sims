import {
    Scene,
    Mesh,
    MeshBuilder,
    Vector3,
    ShadowGenerator,
    StandardMaterial,
    Color3,
} from "@babylonjs/core"



let person_material: StandardMaterial | undefined = undefined


export function create_person (scene: Scene, shadow_generator: ShadowGenerator, position: Vector3)
{
    const body_height = 1.5
    const head_height_radius = 0.15

    const person = new Mesh("person", scene)
    const person_body = MeshBuilder.CreateCylinder("person_body", { height: body_height, diameterBottom: 0.35, diameterTop: 0.50 }, scene)
    const person_head = MeshBuilder.CreateIcoSphere("person_head", { radiusX: 0.08, radiusZ: 0.12, radiusY: head_height_radius, subdivisions: 1 }, scene)

    person_body.position = new Vector3(0, body_height / 2, 0)
    person_head.position = new Vector3(0, body_height + head_height_radius, 0)

    person.addChild(person_body)
    person.addChild(person_head)
    person.position = position


    shadow_generator.addShadowCaster(person_body)
    shadow_generator.addShadowCaster(person_head)
    person_body.receiveShadows = true
    person_head.receiveShadows = true


    if (!person_material)
    {
        person_material = new StandardMaterial("person_material", scene)
        person_material.diffuseColor = new Color3(0.3, 0.3, 0.3)
        person_material.specularColor = new Color3(0, 0, 0)
    }
    person_body.material = person_material
    person_head.material = person_material


    return person
}
