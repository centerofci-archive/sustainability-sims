import {
    AbstractMesh,
    Animation,
    AnimationGroup,
    Color3,
    MeshBuilder,
    Scene,
} from "@babylonjs/core"
import { vec3 } from "../utils/vector"
import { calculate_emissive_color, CreateArrowArgs, create_arrow } from "./create_arrow"


interface CreateArrowChainArgs
{
    distance?: number
    number_of_arrows?: number
}

export function create_arrow_chain (scene: Scene, name: string, arrow_args: CreateArrowArgs, args: CreateArrowChainArgs)
{
    const {
        position,
        rotation,
    } = arrow_args

    const {
        distance = 10,
        number_of_arrows = 3,
    } = args


    const frame_rate = 10
    const total_frames = 40


    const arrow_container = new AbstractMesh(`arrow_chain_${name}_arrow_container`, scene)

    const arrows = new Array(number_of_arrows).fill(0).map(i =>
    {
        const arrow = create_arrow(scene, `arrow_chain_${name}_arrow_${i}`, { ...arrow_args, position: [0, 0, 0] })
        arrow.visibility = 0
        arrow_container.addChild(arrow)


        const animate_pos_y = new Animation(`arrow_animate_pos_y_${name}_arrow_${i}`, "position.y", frame_rate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        const animate_visibility = new Animation(`arrow_animate_visibility_${name}_arrow_${i}`, "visibility", frame_rate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        const animate_emissive_color = new Animation(`arrow_animate_emissive_color_${name}_arrow_${i}`, "material.emissiveColor", frame_rate, Animation.ANIMATIONTYPE_COLOR3, Animation.ANIMATIONLOOPMODE_CYCLE)


        animate_pos_y.setKeys([
            { frame: 0, value: 0 },
            { frame: total_frames, value: distance },
        ])

        animate_visibility.setKeys([
            { frame: 0, value: 0 },
            { frame: total_frames * 0.1, value: 0.99 },
            { frame: total_frames * 0.9, value: 0.99 },
            { frame: total_frames, value: 0 },
        ])

        const emissive_color = calculate_emissive_color(arrow_args.color, arrow_args.glow)
        animate_emissive_color.setKeys([
            { frame: 0, value: new Color3(0, 0, 0) },
            { frame: total_frames * 0.2, value: emissive_color },
            { frame: total_frames * 0.8, value: emissive_color },
            { frame: total_frames, value: new Color3(0, 0, 0) },
        ])


        arrow.animations.push(animate_pos_y)
        arrow.animations.push(animate_visibility)
        arrow.animations.push(animate_emissive_color)


        return arrow
    })


    const vec3_position = vec3(position)
    const vec3_rotation = vec3(rotation)
    arrow_container.position = vec3_position
    if (vec3_rotation) arrow_container.rotation = vec3_rotation


    return {
        play: () =>
        {
            const total_ms = (total_frames / frame_rate) * 1000

            arrows.forEach((arrow, i) =>
            {
                const delay = (i / number_of_arrows) * total_ms
                setTimeout(() =>
                {
                    scene.beginAnimation(arrow, 0, total_frames, true)
                }, delay)
            })
        }
    }
}
