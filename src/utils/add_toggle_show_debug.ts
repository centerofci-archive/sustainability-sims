import { Scene } from "@babylonjs/core"



export function add_toggle_show_debug (scene: Scene)
{
    let showing_debug = false
    ;(window as any).toggle_show_debug = () =>
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
}
