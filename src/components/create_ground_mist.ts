import { Animation, Color4, EasingFunction, ExponentialEase, GPUParticleSystem, Mesh, ParticleSystem, Scene, Texture, Vector3 } from "@babylonjs/core"


export enum Density
{
    verylight = -1,
    light = 0,
    mediumlight = 0.5,
    medium = 1,
    mediumheavy = 1.25,
    heavy = 1.5,
}

let particle_system: GPUParticleSystem | ParticleSystem | undefined
export function create_ground_mist (scene: Scene, size: number, density: Density)
{
    particle_system = create_new_system(scene, size, density, particle_system)
}



const frame_rate = 10


const grow_fog_y = new Animation("grow_fog_y", "position.y",
    frame_rate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
)

// Creating an easing function
const easing_function = new ExponentialEase()
easing_function.setEasingMode(EasingFunction.EASINGMODE_EASEOUT)
grow_fog_y.setEasingFunction(easing_function)


const hide_y = -0.5
grow_fog_y.setKeys([
    { frame: 0, value: hide_y, },
    { frame: frame_rate, value: -0.5, },
])


const use_GPU_version = true
function create_new_system (scene: Scene, size: number, density: number, particle_system: GPUParticleSystem | ParticleSystem | undefined)
{
    const fog_texture = new Texture("./public/textures/smoke.png", scene)
    const fountain = Mesh.CreateBox("fountain", 0.01, scene)
    fountain.visibility = 0
    fountain.position = new Vector3(0, hide_y, 0)
    fountain.animations.push(grow_fog_y)


    if (particle_system) particle_system.dispose()


    const density_power = Math.pow(10, density)
    const partical_count = Math.round(size * size * density_power)


    if (use_GPU_version && GPUParticleSystem.IsSupported) {
        particle_system = new GPUParticleSystem("particles", { capacity: partical_count }, scene)
        particle_system.activeParticleCount = partical_count
        particle_system.manualEmitCount = particle_system.activeParticleCount
        particle_system.minEmitBox = new Vector3(-size, 2, -size) // Starting all from
        particle_system.maxEmitBox = new Vector3(size, 2, size) // To..

    } else {
        particle_system = new ParticleSystem("particles", partical_count, scene)
        particle_system.manualEmitCount = particle_system.getCapacity()
        particle_system.minEmitBox = new Vector3(-size, 2, -size) // Starting all from
        particle_system.maxEmitBox = new Vector3(size, 2, size) // To...
    }


    particle_system.particleTexture = fog_texture.clone()
    particle_system.emitter = fountain

    particle_system.color1 = new Color4(0.8, 0.8, 0.8, 0.1)
    particle_system.color2 = new Color4(.95, .95, .95, 0.15)
    particle_system.colorDead = new Color4(0.9, 0.9, 0.9, 0.1)
    particle_system.minSize = 3.5
    particle_system.maxSize = 5.0
    particle_system.minLifeTime = Number.MAX_SAFE_INTEGER
    particle_system.emitRate = 50000
    particle_system.blendMode = ParticleSystem.BLENDMODE_STANDARD
    particle_system.gravity = new Vector3(0, 0, 0)
    particle_system.direction1 = new Vector3(0, 0, 0)
    particle_system.direction2 = new Vector3(0, 0, 0)
    particle_system.minAngularSpeed = -2
    particle_system.maxAngularSpeed = 2
    particle_system.minEmitPower = .5
    particle_system.maxEmitPower = 1
    particle_system.updateSpeed = density <= Density.verylight ? 0.002 : 0.005


    particle_system.start()
    scene.beginAnimation(fountain, 0, frame_rate, false)

    // scene.onPointerMove = (e, evt) =>
    // {
    //     const position = scene.pick(scene.pointerX, scene.pointerY, mesh => mesh.name !== fountain.name)?.pickedPoint
    //     if (position) fountain.position = position
    // }



    return particle_system
}
