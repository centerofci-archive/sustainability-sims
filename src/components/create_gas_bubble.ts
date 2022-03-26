import {
    Animation,
    SineEase,
    Color3,
    Color4,
    EasingFunction,
    MeshBuilder,
    Scene,
    ShadowGenerator,
    StandardMaterial,
    Vector3,
    Effect,
    ShaderMaterial,
} from "@babylonjs/core"
import { bounded } from "../utils/bounded";


Effect.ShadersStore["rippleVertexShader"] = "precision highp float;\r\n"+

"// Attributes\r\n"+
"attribute vec3 position;\r\n"+
"attribute vec3 normal;\r\n"+
"attribute vec2 uv;\r\n"+

"// Uniforms\r\n"+
"uniform mat4 worldViewProjection;\r\n"+
"uniform float time;\r\n"+
"uniform float bubble_size;\r\n"+

"// Varying\r\n"+
"varying vec4 vPosition;\r\n"+
"varying vec3 vNormal;\r\n"+

"void main() {\r\n"+

"    float inertia = 1. / pow(max(bubble_size, 1.), 0.5);\r\n"+

"    float x = position.x + (sin((position.x + time) * 2. * inertia) - 0.5) * 0.1 * inertia;\r\n"+
"    float y = position.y;\r\n"+
"    float z = position.z + (sin((position.z + time) * 5. * inertia) - 0.5) * 0.07 * inertia;\r\n"+
"    \r\n"+
"    vec4 p = vec4( x, y, z, 1. );\r\n"+

"    vPosition = p;\r\n"+
"    vNormal = normal;\r\n"+

"    gl_Position = worldViewProjection * p;\r\n"+

"}\r\n"


Effect.ShadersStore["rippleFragmentShader"] = "precision highp float;\r\n"+

"uniform mat4 worldView;\r\n"+

"varying vec4 vPosition;\r\n"+
"varying vec3 vNormal;\r\n"+

"uniform vec4 color;\r\n"+
"uniform float bubble_size;\r\n"+

"void main(void) {\r\n"+
"    vec3 n = normalize( worldView * vec4(vNormal, 0.0) ).xyz;\r\n"+

"    float y_ratio = vPosition.y / bubble_size;\r\n"+
"    float brightness = (sin(abs(n.x)) + sin(y_ratio)) / 4.0;\r\n"+
"    float r = clamp(color.x + brightness, 0.0, 1.0);\r\n"+
"    float g = clamp(color.y + brightness, 0.0, 1.0);\r\n"+
"    float b = clamp(color.z + brightness, 0.0, 1.0);\r\n"+
"    float a = color.w;\r\n"+ // clamp(color.w - (brightness / 2.0), 0.0, 1.0);\r\n"+
"    gl_FragColor = vec4( r, g, b, a );\r\n"+
// "    gl_FragColor = vec4( n.x, color.y, color.z, color.w );\r\n"+
"}\r\n";


// Effect.ShadersStore["rippleFragmentShader"] = `
// precision highp float;

// // Varying
// varying vec3 vPosition;
// varying vec3 vNormal;
// varying vec2 vUV;

// // Uniforms
// uniform mat4 world;

// // Refs
// uniform vec3 cameraPosition;
// uniform sampler2D textureSampler;

// void main(void) {
//     vec3 vLightPosition = vec3(0,20,10);

//     // World values
//     vec3 vPositionW = vec3(world * vec4(vPosition, 1.0));
//     vec3 vNormalW = normalize(vec3(world * vec4(vNormal, 0.0)));
//     vec3 viewDirectionW = normalize(cameraPosition - vPositionW);

//     // Light
//     vec3 lightVectorW = normalize(vLightPosition - vPositionW);
//     vec3 color = texture2D(textureSampler, vUV).rgb;

//     // diffuse
//     float ndl = max(0., dot(vNormalW, lightVectorW));

//     // Specular
//     vec3 angleW = normalize(viewDirectionW + lightVectorW);
//     float specComp = max(0., dot(vNormalW, angleW));
//     specComp = pow(specComp, max(1., 64.)) * 2.;

//     gl_FragColor = vec4(color * ndl + vec3(specComp), 1.);
// }
// `


export function create_gas_bubble (scene: Scene, position: Vector3, volume_m3: number, color: Color4, shadow_generator?: ShadowGenerator)
{
    let radius = volume_to_radius(volume_m3)
    color = color.clone()


    const ripple_shader_material = new ShaderMaterial("ripple_shader", scene,
        { vertex: "ripple", fragment: "ripple" },
        {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
        }
    )
    ripple_shader_material.setFloat("time", 0)
    ripple_shader_material.setFloat("bubble_size", radius)
    ripple_shader_material.setColor4("color", color)
    // ripple_shader_material.setVector3("bubblePosition", position)
    // ripple_shader_material.setVector3("cameraPosition", Vector3.Zero())
    ripple_shader_material.backFaceCulling = true


    // const gas_material = new StandardMaterial("gas", scene)
    // gas_material.specularColor = new Color3(
    //     Math.min(color.r * 0.3, 0.2),
    //     Math.min(color.g * 0.3, 0.2),
    //     Math.min(color.b * 0.3, 0.2)
    // )
    // gas_material.diffuseColor = new Color3(color.r, color.g, color.b)


    const frame_rate = 10
    const total_frames = 40

    const gas_bubble = MeshBuilder.CreateIcoSphere("gas_bubble", { radius: 1, subdivisions: 5 }, scene)
    gas_bubble.scaling = Vector3.One().scale(radius)
    gas_bubble.visibility = color.a


    if (shadow_generator)
    {
        gas_bubble.receiveShadows = true
        shadow_generator.addShadowCaster(gas_bubble)
    }

    gas_bubble.material = ripple_shader_material // gas_material
    gas_bubble.position = position.clone()


    const animate_pos_y = new Animation("gas_bubble_animate_pos_y", "position.y", frame_rate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
    animate_pos_y.setKeys([
        { frame: 0, value: position.y },
        { frame: total_frames / 2, value: position.y + (radius * 0.3) },
        { frame: total_frames, value: position.y },
    ])
    gas_bubble.animations.push(animate_pos_y)

    const ease_position_y = new SineEase()
    ease_position_y.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
    animate_pos_y.setEasingFunction(ease_position_y)


    function play ()
    {
        scene.beginAnimation(gas_bubble, 0, total_frames, true)

        let time = 0
        const interval_timeout = setInterval(() =>
        {
            // const camera_position = scene.getCameraByName("orbitalCamera")?.position
            // if (camera_position)
            // {
            //     ripple_shader_material.setVector3("cameraPosition", camera_position)
            // }

            ripple_shader_material.setFloat("time", time)
            time += 0.05
        }, 50)

        gas_bubble.onDispose = () => clearTimeout(interval_timeout)
    }


    const new_radius = { start_value: 0, target_value: 0, animating: false, start_at: 0 }

    return {
        play,
        opacity: (new_opacity = 0) =>
        {
            new_opacity = bounded(new_opacity, 0, 1)

            function change_opacity ()
            {
                if (color.a === new_opacity) return
                const diff = new_opacity - color.a
                const change = Math.min(Math.abs(diff), 0.05)
                if (change < 0.05) color.a = new_opacity
                else
                {
                    color.a += (change * Math.sign(diff))
                    color.a = bounded(color.a, 0, 1)
                }

                ripple_shader_material.setColor4("color", color)
                setTimeout(change_opacity, 50)
            }
            change_opacity()
        },
        grow: (new_volume_m3: number, animation_speed = 3000) =>
        {
            new_radius.start_value = radius
            new_radius.target_value = volume_to_radius(new_volume_m3)
            new_radius.start_at = performance.now()

            if (new_radius.animating) return
            new_radius.animating = true

            function change_size ()
            {
                const now = performance.now()
                const end_at = new_radius.start_at + animation_speed
                if (now >= end_at)
                {
                    radius = new_radius.target_value
                    new_radius.animating = false
                }
                else
                {
                    const progress_time = (now - new_radius.start_at) / animation_speed
                    const progress_rads = (progress_time * Math.PI)
                    const progress_ratio = (1 - Math.cos(progress_rads)) / 2


                    const diff = new_radius.target_value - new_radius.start_value
                    radius = (diff * progress_ratio) + new_radius.start_value
                    setTimeout(change_size, 50)
                }

                ripple_shader_material.setFloat("bubble_size", radius)
                gas_bubble.scaling = Vector3.One().scale(radius)
            }
            change_size()
        },
    }
}



function volume_to_radius (volume: number)
{
    return Math.pow((volume * 0.75) / Math.PI, 1/3)
}
