import { Scene } from "@babylonjs/core"
import { AdvancedDynamicTexture, Button, Control, StackPanel, TextBlock } from "@babylonjs/gui"
import { units_to_string } from "../../../data_support/units/utils"
import { TemporalRangeValue } from "../../../data_support/value"
import { valid_ui_msg } from "../../../state/ui_pub_sub"
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

    add_button("ui_toggle_show_natural_gas_bubble", "Show gas", panel, 0.5)
    add_button("ui_toggle_show_co2_bubble", "Show CO2", panel, 0.5)

    const text_actions = new TextBlock()
    text_actions.text = `Action`
    text_actions.height = "30px"
    text_actions.color = "orange"
    panel.addControl(text_actions)

    add_button("ui_toggle_action_plant_trees", "Plant trees", panel)
    add_button("ui_toggle_action_protect_peatland", "Protect peatland", panel)
    add_button("ui_toggle_action_improve_insulation", "Improve insulation", panel)


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



function add_button (ui_action: valid_ui_msg, description: string, panel: StackPanel, width = 0.7)
{
    const button = Button.CreateSimpleButton("button_" + ui_action, description)
    button.width = width
    button.height = "30px"
    button.color = "white"
    button.onPointerClickObservable.add(() =>
    {
        pub_sub.ui.pub(ui_action, undefined)
    })
    panel.addControl(button)
}
