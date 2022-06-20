import { Scene } from "@babylonjs/core"



export function add_toggle_show_debug (scene: Scene)
{
    let showing_debug = false
    const toggle_show_debug = () =>
    {
        showing_debug = !showing_debug
        if (showing_debug)
        {
            scene.debugLayer.show({ overlay: true })
        }
        else
        {
            scene.debugLayer.hide()
        }
    }

    // toggle_show_debug()

    ;(window as any).toggle_show_debug = toggle_show_debug
}
