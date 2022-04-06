import { Scene } from "@babylonjs/core"
import { AdvancedDynamicTexture, Control, StackPanel, TextBlock } from "@babylonjs/gui"



export function ui_show_name (scene: Scene, name: string)
{
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene)

    const panel = new StackPanel()
    panel.width = "220px"
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
    advancedTexture.addControl(panel)

    const header = new TextBlock()
    header.text = name
    header.height = "30px"
    header.color = "white"
    panel.addControl(header)
}
