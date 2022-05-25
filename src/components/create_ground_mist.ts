import * as BABYLON from "@babylonjs/core"
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


// Creating an easing function
const easing_function = new ExponentialEase()
const hide_y = -3.5
const target_y = -0.5


// const use_GPU_version = false
function create_new_system (scene: Scene, size: number, density: number, particle_system: GPUParticleSystem | ParticleSystem | undefined)
{
    const fog_texture = new Texture("textures/smoke.png", scene)
    const fountain = Mesh.CreateBox("fountain", 0.01, scene)
    fountain.visibility = 0
    fountain.position = new Vector3(0, hide_y, 0)


    if (particle_system) particle_system.dispose()


    const density_power = Math.pow(10, density)
    const partical_count = Math.round(size * size * density_power)


    // Not possible to use GPU with custom updateFunction
    // if (use_GPU_version && GPUParticleSystem.IsSupported) {
    //     particle_system = new GPUParticleSystem("particles", { capacity: partical_count }, scene)
    //     particle_system.activeParticleCount = partical_count
    //     particle_system.manualEmitCount = particle_system.activeParticleCount
    //     particle_system.minEmitBox = new Vector3(-size, 2, -size) // Starting all from
    //     particle_system.maxEmitBox = new Vector3(size, 2, size) // To..

    // } else {
        particle_system = new ParticleSystem("particles", partical_count, scene)
        particle_system.manualEmitCount = particle_system.getCapacity()
        particle_system.minEmitBox = new Vector3(-size, 2, -size) // Starting all from
        particle_system.maxEmitBox = new Vector3(size, 2, size) // To...
    // }


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


    type ExtendedParticles = { start_time?: number, last_time?: number, total_y?: number } & BABYLON.Particle[]

    particle_system.updateFunction = function (_particles) {
        const particles = _particles as ExtendedParticles
        particles.start_time = particles.start_time || performance.now()
        const total_age = performance.now() - particles.start_time

        let y_inc = 0
        if (particles.total_y === undefined || particles.total_y <= target_y)
        {
            y_inc = particles.last_time ? (performance.now() - particles.last_time) / 1000 : 0

            particles.total_y = particles.total_y ?? hide_y
            particles.total_y += y_inc

            // todo could limit y_inc to not exceed target_y
        }

        particles.last_time = performance.now()

        const max_time = 6000
        // This logic is not 100% right
        const needs_update = total_age <= max_time
        const max_a = 0.15
        let a = max_a
        if (needs_update)
        {
            a = Math.min((total_age / max_time) * max_a, max_a)
        }

        for (var index = 0; index < particles.length; index++) {
            var particle = particles[index];

            if (needs_update)
            {
                particle.color.a = a
                particle.position.addInPlaceFromFloats(0, y_inc, 0)
            }

            particle.angle += particle.angularSpeed * (this as any)._scaledUpdateSpeed;
        }
    }


    particle_system.start()


    return particle_system
}
