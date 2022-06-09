import { AdvancedDynamicTexture, Control, StackPanel, TextBlock } from "@babylonjs/gui"



export function ui_show_name (ui_full_screen_advanced_texture: AdvancedDynamicTexture, name: string)
{
    const panel = new StackPanel()
    panel.width = "220px"
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
    ui_full_screen_advanced_texture.addControl(panel)

    const header = new TextBlock()
    header.text = name
    header.height = "30px"
    header.color = "white"
    panel.addControl(header)
}
