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
    header.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
    header.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
    panel.addControl(header)

    // const slider = new Slider()
    // slider.minimum = 0
    // slider.maximum = 2 * Math.PI
    // slider.value = 0
    // slider.height = "20px"
    // slider.width = "200px"
    // slider.onValueChangedObservable.add(function(value)
    // {
    //     header.text = "Y-rotation: " + (Tools.ToDegrees(value) | 0) + " deg"
    //     // if (skull) {
    //     //     skull.rotation.y = value
    //     // }
    // })
    // // panel.addControl(slider)
}
