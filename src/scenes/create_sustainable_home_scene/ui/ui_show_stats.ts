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

    const text_gas_volume_header = new TextBlock()
    text_gas_volume_header.text = `Gas consumption\nin ${units_to_string(gas_m3_per_month_value.units)} per month`
    text_gas_volume_header.height = "50px"
    text_gas_volume_header.color = "white"
    panel.addControl(text_gas_volume_header)

    const text_gas_volume_value = new TextBlock()
    const vol = Number((gas_m3_per_month_value.value).toPrecision(2))
    text_gas_volume_value.text = `${vol}`
    const style = advancedTexture.createStyle()
    style.fontSize = 30
    text_gas_volume_value.style = style
    text_gas_volume_value.height = "50px"
    text_gas_volume_value.color = "white"
    panel.addControl(text_gas_volume_value)

    const text_visualise = new TextBlock()
    text_visualise.text = `Visualise`
    text_visualise.height = "30px"
    text_visualise.color = "blue"
    panel.addControl(text_visualise)

    add_button("ui_toggle_show_natural_gas_bubble", "Show gas", panel, 0.5)
    add_button("ui_toggle_show_co2_bubble", "Show CO2", panel, 0.5)
    add_button("ui_toggle_show_co2_bubble__max", "Show max CO2", panel, 0.5)

    const text_actions = new TextBlock()
    text_actions.text = `Individual Action`
    text_actions.height = "30px"
    text_actions.color = "orange"
    panel.addControl(text_actions)

    add_button("ui_toggle_action_protect_trees", "Protect trees", panel)
    add_button("ui_toggle_action_plant_trees", "Plant trees", panel)
    add_button("ui_toggle_action_protect_peatland", "Protect peatland", panel)
    add_button("ui_toggle_action_improve_insulation", "Improve insulation", panel)


    let added_ui = false
    pub_sub.ui.sub("ui_toggle_action_protect_trees", () =>
    {
        if (added_ui) return
        added_ui = true

        const text_visualise_tree_action_effects = new TextBlock()
        text_visualise_tree_action_effects.text = `Visualise tree effects`
        text_visualise_tree_action_effects.height = "30px"
        text_visualise_tree_action_effects.color = "blue"
        panel.addControl(text_visualise_tree_action_effects)

        add_button("ui_toggle_show_tree_CO2_absorbed", "Show tree CO2", panel)
    })

    pub_sub.ui.sub("ui_toggle_action_plant_trees", () =>
    {
        if (added_ui) return
        added_ui = true

        const text_visualise_tree_action_effects = new TextBlock()
        text_visualise_tree_action_effects.text = `Visualise tree effects`
        text_visualise_tree_action_effects.height = "30px"
        text_visualise_tree_action_effects.color = "blue"
        panel.addControl(text_visualise_tree_action_effects)

        add_button("ui_toggle_show_tree_CO2_absorbed", "Show tree CO2", panel)
    })


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
