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

    const text_visualise = new TextBlock()
    text_visualise.text = `Visualise`
    text_visualise.height = "30px"
    text_visualise.color = "blue"
    panel.addControl(text_visualise)

    const button_show_gas = Button.CreateSimpleButton("button_show_gas", "Show gas")
    button_show_gas.width = 0.5
    button_show_gas.height = "30px"
    button_show_gas.color = "white"
    button_show_gas.onPointerClickObservable.add(() =>
    {
        pub_sub.ui.pub("ui_toggle_show_natural_gas_bubble", undefined)
    })
    // button.background = "blue"
    panel.addControl(button_show_gas)

    const button_show_co2 = Button.CreateSimpleButton("button_show_co2", "Show CO2")
    button_show_co2.width = 0.5
    button_show_co2.height = "30px"
    button_show_co2.color = "white"
    button_show_co2.onPointerClickObservable.add(() =>
    {
        pub_sub.ui.pub("ui_toggle_show_co2_bubble", undefined)
    })
    // button.background = "blue"
    panel.addControl(button_show_co2)

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
