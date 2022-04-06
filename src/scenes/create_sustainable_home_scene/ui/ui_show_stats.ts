import { Scene } from "@babylonjs/core"
import { AdvancedDynamicTexture, Button, Control, StackPanel, TextBlock } from "@babylonjs/gui"
import { units_to_string } from "../../../data_support/units/utils"
import { TemporalRangeValue } from "../../../data_support/value"
import { pub_sub } from "../../../utils/pub_sub"



export function ui_show_stats (scene: Scene, gas_m3_per_month_value: TemporalRangeValue)
{
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene)

    const panel = new StackPanel()
    panel.width = "220px"
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
    advancedTexture.addControl(panel)

    const header = new TextBlock()
    const vol = Number((gas_m3_per_month_value.value).toPrecision(2))
    header.text = `Gas consumption: ${vol} ${units_to_string(gas_m3_per_month_value.units)}`
    header.height = "30px"
    header.color = "white"
    panel.addControl(header)

    const button = Button.CreateSimpleButton("button_show_gas", "Show gas")
    button.width = 0.4
    button.height = "30px"
    button.color = "white"
    button.onPointerClickObservable.add(() =>
    {
        pub_sub.ui.pub("ui_toggle_show_gas", undefined)
    })
    // button.background = "blue"
    panel.addControl(button)

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
