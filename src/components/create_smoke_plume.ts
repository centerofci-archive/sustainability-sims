import { AbstractMesh, Animation, Color3, MeshBuilder, Scene, ShadowGenerator, StandardMaterial, Vector3 } from "@babylonjs/core"



interface EmitterOptions
{
    emit_position1: Vector3
    // emit_position2?: Vector3
    number?: number
    lifetime?: number
    speed?: number
}


let smoke_material: StandardMaterial | undefined


export function create_smoke_plume (scene: Scene, shadow_generator: ShadowGenerator, options: EmitterOptions)
{
    if (!smoke_material)
    {
        smoke_material = new StandardMaterial("smoke", scene)
        smoke_material.specularColor = new Color3(0,0,0)
        smoke_material.diffuseColor = new Color3(0.7, 0.7, 0.7)
    }

    const { emit_position1, number = 20, lifetime = 10, speed = 0.5 } = options

    const frame_rate = 10
    const total_frames = frame_rate * lifetime


    const smokes: { mesh: AbstractMesh, delay: number }[] = []


    let i = 0
    while (i < number)
    {
        const smoke_container = new AbstractMesh("smoke_container_" + i)

        const smoke_ball = MeshBuilder.CreateIcoSphere("smoke_" + i, { radius: 0.2, subdivisions: 2 }, scene)
        smoke_container.addChild(smoke_ball)
        smoke_container.rotateAround(emit_position1, new Vector3(Math.random(), 0, Math.random()), (Math.random() - 0.5) * 0.4)

        smoke_ball.material = smoke_material
        smoke_ball.position = emit_position1.clone()

        const animate_pos_y = new Animation("smoke_animate_pos_y_" + i, "position.y", frame_rate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        animate_pos_y.setKeys([
            { frame: 0, value: emit_position1.y },
            { frame: total_frames, value: emit_position1.y + (speed * lifetime) }, // * (Math.random() + 1)) },
        ])
        smoke_ball.animations.push(animate_pos_y)


        const animate_opacity = new Animation("smoke_animate_opacity_" + i, "visibility", frame_rate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        const disappear = 0.9 + (Math.random() / 10)
        animate_opacity.setKeys([
            { frame: 0, value: 1 },
            { frame: total_frames * 0.8 * disappear, value: 1 },
            { frame: total_frames * disappear, value: 0 },
            { frame: total_frames, value: 0 },
        ])
        smoke_ball.animations.push(animate_opacity)


        const animate_scale = new Animation("smoke_animate_scale_" + i, "scaling", frame_rate, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE)
        animate_scale.setKeys([
            { frame: 0, value: Vector3.One() },
            { frame: total_frames, value: Vector3.One().scale(3) },
        ])
        smoke_ball.animations.push(animate_scale)


        // const animate_rotation = new Animation("smoke_animate_rotation_" + i, "rotation.y", frame_rate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        // animate_rotation.setKeys([
        //     { frame: 0, value: 0 },
        //     { frame: total_frames, value: Math.random() * 2 },
        // ])
        // smoke_ball.animations.push(animate_rotation)


        const delay = (i / number) * lifetime * 1000

        smokes.push({ mesh: smoke_ball, delay })

        ++i
    }


    function play ()
    {
        smokes.forEach(({ mesh, delay }) =>
        {
            setTimeout(() => scene.beginAnimation(mesh, 0, total_frames, true), delay)
        })
    }


    return {
        play,
    }
}
