import { AbstractMesh, Color3, Color4, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core"
import { vec3 } from "../utils/vector"



export function create_ground (scene: Scene, size: number, position?: Vector3)
{
    const height = 1
    position = position || vec3([size/2, -height/2, size/2]) // default get center point onto 0,0,0

    const green = new Color4(0.2, 0.3, 0, 1)
    const brown = new Color4(0.2, 0.15, 0, 1)
    const faceColors: Color4[] = [brown, brown, brown, brown, green, brown]

    const ground = MeshBuilder.CreateBox("ground", { width: size, depth: size, height, faceColors }, scene)
    ground.setPivotPoint(vec3([size/2, height/2, size/2]))
    ground.position = vec3([0, -height/2, 0])

    const ground_container = new AbstractMesh("ground_container")
    ground_container.position = position
    ground_container.addChild(ground)

    const semimatt_material = new StandardMaterial("semimatt_material", scene)
    semimatt_material.specularColor = new Color3(0.05, 0.05, 0.05)
    ground.material = semimatt_material

    ground.receiveShadows = true


    function resize_ground (new_size: number)
    {
        const scale = new_size / size
        ground.scaling = vec3([scale, 1, scale])
    }


    return {
        ground,
        resize_ground,
    }
}
