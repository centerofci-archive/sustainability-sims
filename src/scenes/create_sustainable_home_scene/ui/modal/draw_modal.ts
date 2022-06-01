import { AdvancedDynamicTexture, Rectangle } from "@babylonjs/gui"



export interface ModalReturn
{
    dispose: () => void
}


export function draw_modal (ui_layer: AdvancedDynamicTexture): ModalReturn
{
    const outer_window = new Rectangle()
    outer_window.width = 0.6
    outer_window.height = "300px"
    outer_window.cornerRadius = 20
    outer_window.color = "white"
    outer_window.thickness = 2
    outer_window.background = "lightblue"
    ui_layer.addControl(outer_window)

    return { dispose: () => outer_window.dispose() }
}
