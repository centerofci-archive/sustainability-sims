import { Scene } from "@babylonjs/core"
import { AdvancedDynamicTexture, Button, Control, StackPanel, TextBlock } from "@babylonjs/gui"
import { units_to_string } from "../../../data_support/units/utils"
import { TemporalRangeValue } from "../../../data_support/value"
import { valid_ui_msg } from "../../../state/ui_pub_sub"
import { pub_sub } from "../../../utils/pub_sub"



export function ui_show_stats (scene: Scene, gas_m3_per_year_value: TemporalRangeValue)
{
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene)

    const panel = new StackPanel()
    panel.width = "220px"
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
    advancedTexture.addControl(panel)

    const text_gas_volume_header = new TextBlock()
    text_gas_volume_header.text = `Gas consumption\nin ${units_to_string(gas_m3_per_year_value.units)} per year`
    text_gas_volume_header.height = "50px"
    text_gas_volume_header.color = "white"
    panel.addControl(text_gas_volume_header)

    const text_gas_volume_value = new TextBlock()
    const vol = Number((gas_m3_per_year_value.value).toPrecision(2))
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

    add_button("ui_toggle_show_natural_gas_bubble", "Show gas", panel, { width: 0.5 })
    add_button("ui_toggle_show_co2_bubble", "Show CO2", panel, { width: 0.5 })
    // add_button("ui_toggle_show_co2_bubble__max", "Show max CO2", panel, { width: 0.5 })

    const text_actions = new TextBlock()
    text_actions.text = `Individual Action`
    text_actions.height = "30px"
    text_actions.color = "orange"
    panel.addControl(text_actions)

    add_button("ui_toggle_action_protect_trees", "Protect trees", panel)
    // add_button("ui_toggle_action_plant_trees", "Plant trees", panel)
    // add_button("ui_toggle_action_protect_peatland", "Protect peatland", panel)
    add_button("ui_toggle_action_improve_insulation", "<Not implemented: Improve insulation>", panel, { height: 60 })


    pub_sub.ui.sub("ui_toggle_action_protect_trees", () => extend_ui_with_forest_related_ui())
    pub_sub.ui.sub("ui_toggle_action_plant_trees", () => extend_ui_with_forest_related_ui())

    let added_forest_related_ui = false
    function extend_ui_with_forest_related_ui ()
    {
        if (added_forest_related_ui) return
        added_forest_related_ui = true

        const text_visualise_tree_action_effects = new TextBlock()
        text_visualise_tree_action_effects.text = `Visualise tree effects`
        text_visualise_tree_action_effects.height = "30px"
        text_visualise_tree_action_effects.color = "blue"
        panel.addControl(text_visualise_tree_action_effects)

        add_button("ui_toggle_show_tree_CO2_absorbed", "Show tree CO2", panel)


        const text_visualise_forest_area_constaints = new TextBlock()
        text_visualise_forest_area_constaints.text = `Forest area constraints`
        text_visualise_forest_area_constaints.height = "30px"
        text_visualise_forest_area_constaints.color = "blue"
        panel.addControl(text_visualise_forest_area_constaints)

        add_button("ui_toggle_show_forest_area_constraint_personal_property_area", "Personal property", panel)
        add_button("ui_toggle_show_forest_area_constraint_existing_forest_country_area", "Existing Forest Country Area per Home", panel, { height: 60 })
        add_button("ui_toggle_show_forest_area_constraint_max_forestable_country_area", "Max Forestable Country Area per Home", panel, { height: 60 })
        add_button("ui_toggle_show_forest_area_constraint_max_forestable_city_plus_country_area", "Max Forestable + City Trees Country Area per Home", panel, { height: 60 })
        // add_button("ui_toggle_show_forest_area_constraint_world_area", "World area per home", panel)
    }


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



function add_button (ui_action: valid_ui_msg, description: string, panel: StackPanel, options: { width?: number, height?: number } = {})
{
    const button = Button.CreateSimpleButton("button_" + ui_action, description)
    button.width = options.width ?? 0.7
    button.height = `${options.height ?? 30}px`
    button.color = "white"
    button.onPointerClickObservable.add(() =>
    {
        pub_sub.ui.pub(ui_action, undefined)
    })
    panel.addControl(button)
}
