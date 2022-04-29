import {
    Animation,
    ArcRotateCamera,
    EasingFunction,
    IAnimationKey,
    Mesh,
    Scene,
    SineEase,
    Vector3,
} from "@babylonjs/core"



const frames_per_second = 24
const total_frames = 1 * frames_per_second



export function change_camera_angle (scene: Scene, camera: ArcRotateCamera, options: { alpha?: number, beta?: number, radius?: number } = {})
{
    const new_alpha = options.alpha ?? camera.alpha
    const new_beta = options.beta ?? camera.beta
    const new_radius = options.radius ?? camera.radius

    const animation_camera_alpha = new Animation(
        "animation_camera_alpha",
        "alpha",
        frames_per_second,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
    )

    const animation_camera_beta = new Animation(
        "animation_camera_beta",
        "beta",
        frames_per_second,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
    )

    const animation_camera_radius = new Animation(
        "animation_camera_radius",
        "radius",
        frames_per_second,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
    )


    const animation_keys_camera_alpha: IAnimationKey[] = [
        { frame: 0, value: camera.alpha },
        { frame: total_frames, value: new_alpha },
    ]

    const animation_keys_camera_beta: IAnimationKey[] = [
        { frame: 0, value: camera.beta },
        { frame: total_frames, value: new_beta },
    ]

    const animation_keys_camera_radius: IAnimationKey[] = [
        { frame: 0, value: camera.radius },
        { frame: total_frames, value: new_radius },
    ]


    animation_camera_alpha.setKeys(animation_keys_camera_alpha)
    animation_camera_beta.setKeys(animation_keys_camera_beta)
    animation_camera_radius.setKeys(animation_keys_camera_radius)


    const ease = new SineEase()
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
    animation_camera_alpha.setEasingFunction(ease)
    animation_camera_beta.setEasingFunction(ease)
    animation_camera_radius.setEasingFunction(ease)


    return scene.beginDirectAnimation(camera, [
        animation_camera_alpha,
        animation_camera_beta,
        animation_camera_radius
    ], 0, total_frames, false)
}



export function retarget_camera (scene: Scene, camera: ArcRotateCamera, new_target: Vector3, options: { max_distance?: number, keep_angle?: boolean } = {})
{
    let new_position = camera.position.clone()

    if (options.max_distance !== undefined || options.keep_angle)
    {
        // vector_from_new_target
        let vector = camera.position.subtract(new_target)

        if (options.keep_angle) vector = camera.position.subtract(camera.target)

        const ratio = options.max_distance === undefined ? 1 : options.max_distance / vector.length()
        if (ratio < 1 || options.keep_angle)
        {
            new_position = new_target.add(vector.scale(ratio))
        }
    }

    return retarget_and_move_camera(scene, camera, new_target, new_position)
}



export function retarget_and_move_camera_to_include_mesh (scene: Scene, camera: ArcRotateCamera, mesh: Mesh)
{
    const field_of_view_angle = camera.fov
    const mesh_sphere = mesh.getBoundingInfo().boundingSphere
    const size = mesh_sphere.radiusWorld
    const distance = size / Math.tan(field_of_view_angle/2)

    let new_position = camera.position.subtract(camera.target)
    new_position = new_position.normalize().scale(distance)
    new_position.addInPlace(mesh_sphere.centerWorld)

    return retarget_and_move_camera(scene, camera, mesh_sphere.centerWorld, new_position)
}



function retarget_and_move_camera (scene: Scene, camera: ArcRotateCamera, new_target: Vector3, new_position?: Vector3)
{
    const diff = new_target.subtract(camera.target)
    new_position = new_position || camera.position.add(diff)


    const animation_camera_target = new Animation(
        "animation_camera_target",
        "target",
        frames_per_second,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CYCLE
    )

    const animation_camera_position = new Animation(
        "animation_camera_position",
        "position",
        frames_per_second,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CYCLE
    )


    const animation_keys_camera_target: IAnimationKey[] = [
        { frame: 0, value: camera.target.clone() },
        { frame: total_frames, value: new_target },
    ]

    const animation_keys_camera_position: IAnimationKey[] = [
        { frame: 0, value: camera.position.clone() },
        { frame: total_frames, value: new_position },
    ]


    animation_camera_target.setKeys(animation_keys_camera_target)
    animation_camera_position.setKeys(animation_keys_camera_position)


    const ease = new SineEase()
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
    animation_camera_target.setEasingFunction(ease)
    animation_camera_position.setEasingFunction(ease)


    return scene.beginDirectAnimation(camera, [
        animation_camera_target,
        animation_camera_position,
    ], 0, total_frames, false)
}
