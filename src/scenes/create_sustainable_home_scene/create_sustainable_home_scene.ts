import { AbstractMesh, Color4, Tools, Vector3 } from "@babylonjs/core"
import { AdvancedDynamicTexture, TextBlock, StackPanel, Control, Slider, } from "@babylonjs/gui"
import { CreateArrowArgs } from "../../components/create_arrow"
import { create_arrow_chain } from "../../components/create_arrow_chain"
import { create_forest } from "../../components/create_forest"

import { create_gas_bubble } from "../../components/create_gas_bubble"
import { create_ground } from "../../components/create_ground"
import { create_ground_mist, Density } from "../../components/create_ground_mist"
import { create_house } from "../../components/create_house"
import { create_person, person_mesh_names } from "../../components/create_person"
import { create_sky } from "../../components/create_sky"
import { create_smoke_plume } from "../../components/create_smoke_plume"
import { scale_to_approximately_a_year, time_period_to_days } from "../../data_support/datetime/range"
import { days_range, subtract_days_from_date } from "../../data_support/datetime/subtract"
import { convert_value } from "../../data_support/units/convert"
import { UnitsID } from "../../data_support/units/units"
import { TemporalRangeValue } from "../../data_support/value"
import { ValueOrError } from "../../data_support/value_or_error"
import { retarget_and_move_camera_to_include_mesh } from "../../utils/move_camera"
import { pub_sub } from "../../utils/pub_sub"
import { shuffle } from "../../utils/random"
import { get_url_param, get_url_param_number, URLParams } from "../../utils/url_params_parser"
import { vec3 } from "../../utils/vector"
import { CreateContentCommonArgs } from "../content"
import { listen_for_double_click } from "./listen_for_double_click"
import { ui_show_name } from "./ui/ui_show_name"
import { ui_show_stats } from "./ui/ui_show_stats"



export const create_sustainable_home_scene = ({ scene, camera, shadow_generator}: CreateContentCommonArgs, ground_size: number, url_params: URLParams) =>
{
    create_sky(scene)

    const ground_position = vec3([ground_size / 2, -0.5, ground_size / 2])
    const { ground, resize_ground } = create_ground(scene, ground_size, ground_position)

    const natural_gas_bubble = create_gas_bubble(scene, { position: new Vector3(10, 2, -2), volume_m3: 0, color: new Color4(0.25, 0.3, 0.5, 0.8), shadow_generator })
    natural_gas_bubble.play()
    natural_gas_bubble.gas_bubble_mesh.setEnabled(false)

    const co2_bubble = create_gas_bubble(scene, { position: new Vector3(0, 4, -2), volume_m3: 0, color: new Color4(0.5, 0.05, 0.0, 0.8), shadow_generator })
    co2_bubble.play()
    co2_bubble.gas_bubble_mesh.setEnabled(false)


    const people = shuffle(person_mesh_names)
    create_person(scene, shadow_generator, new Vector3(-4, 0, 3), people[0])
    create_person(scene, shadow_generator, new Vector3(0, 0, 5), people[1])
    create_person(scene, shadow_generator, new Vector3(2, 0, 4), people[2])
    create_house(scene, shadow_generator, Vector3.Zero(), "house")

    const { play } = create_smoke_plume(scene, { emit_position1: new Vector3(0.5, 4.2, -1.9) }, shadow_generator)
    play()


    const params = {
        gas_period: get_url_param(url_params, "gas_period"),
        gas_volume: get_url_param_number(url_params, "gas"),
        gas_units: get_url_param(url_params, "gas_units"),
        name: get_url_param(url_params, "name"),
        home_footprint_m2: get_url_param_number(url_params, "home_footprint_m2"),
        home_property_m2: get_url_param_number(url_params, "home_property_m2"),
        forest_kg_co2_per_m2_per_year: get_url_param_number(url_params, "forest_co2_absorb"),
        mangrove_kg_co2_per_m2_per_year: get_url_param_number(url_params, "mangrove_co2_absorb"),
        peatland_kg_co2_per_m2_per_year: get_url_param_number(url_params, "peatland_co2_absorb"),
    }

    const ok_params: {[k in keyof typeof params]: Exclude<(typeof params[k])["value"], undefined>} = {} as any

    let failure = false
    ;(Object.keys(params) as (keyof typeof params)[]).forEach(key =>
    {
        const result = params[key]

        if (result.value === undefined)
        {
            console.error(`Error in "${key}" param`, result.error)
            failure = true
        }
        else
        {
            (ok_params[key] as any) = result.value
        }
    })

    if (failure) return


    const {
        name,
        gas_period,
        gas_volume,
        gas_units,
        forest_kg_co2_per_m2_per_year,
        home_footprint_m2,
        home_property_m2,
    } = ok_params

    // Assume you can not use roof and assume you can use all land right up to next of property
    // (clearly not true as some tree roots known to damage properties with weak or small foundations)
    const land_area_m2 = home_property_m2 - home_footprint_m2


    const sanitised_gas_params = sanitise_gas_params({ gas_period, gas_volume, gas_units })
    if (sanitised_gas_params.value === undefined)
    {
        console.error("Error in gas params", sanitised_gas_params.error)
        return
    }

    const gas_m3_per_year = calculate_gas_m3_per_year(sanitised_gas_params.value)
    if (gas_m3_per_year.value === undefined)
    {
        console.error("Error converting gas to m3 per year", gas_m3_per_year.error)
        return
    }
    const gas_m3_per_year_value = gas_m3_per_year.value


    pub_sub.ui.sub("ui_toggle_show_natural_gas_bubble", () =>
    {
        const enable = !natural_gas_bubble.gas_bubble_mesh.isEnabled()
        natural_gas_bubble.gas_bubble_mesh.setEnabled(enable)
        natural_gas_bubble.grow(gas_m3_per_year_value.value)
    })

    pub_sub.ui.sub("ui_toggle_show_co2_bubble", () =>
    {
        const enable = !co2_bubble.gas_bubble_mesh.isEnabled()
        co2_bubble.gas_bubble_mesh.setEnabled(enable)
        co2_bubble.grow(gas_m3_per_year_value.value)
    })

    pub_sub.ui.sub("ui_toggle_show_co2_bubble__max", () =>
    {
        const enable = !co2_bubble.gas_bubble_mesh.isEnabled()
        co2_bubble.gas_bubble_mesh.setEnabled(enable)
        // https://www.effectech.co.uk/wp-content/uploads/Assessing_the_UKs_gas_quality_measurement_infrastructure.pdf
        // Only including ethane, propane, and butane
        // 1.16 = ((100 - (7.33 + 2.41  + (0.48 + 0.89))) + (7.33 * 2) + (2.41 * 3) + ((0.48 + 0.89) * 4)) / 100
        // https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/545567/Material_comparators_for_fuels_-_natural_gas.pdf
        co2_bubble.grow(gas_m3_per_year_value.value * 1.16)
    })


    const kg_CO2_per_year = gas_m3_per_year_value.value
    const forest_m2 = kg_CO2_per_year / forest_kg_co2_per_m2_per_year
    console.log("forest_m2", forest_m2)
    const forest_size_m = Math.round(Math.pow(forest_m2, 0.5))
    let { tree_nodes, play: grow_forest } = create_forest(scene, shadow_generator, new Vector3(-5, 0, -5), forest_size_m)

    // // remove trees near house
    // const near = 5
    // tree_nodes = tree_nodes.filter(tree =>
    // {
    //     if (tree.position.x > -near && tree.position.x < near && tree.position.z > -near && tree.position.z < near)
    //     {
    //         tree.dispose()
    //         return false
    //     }
    //     return true
    // })


    let animated = false
    let protected_trees = true
    const planted_tree_size = 0.2

    pub_sub.ui.sub("ui_toggle_action_protect_trees", () =>
    {
        protected_trees = true

        // trees.forEach(tree =>
        // {
        //     // const scale = Vector3.One().scale(tree.size)
        //     // tree.getChildMeshes().forEach(mesh => mesh.scaling = scale.clone())
        // })

        if (animated) return
        animated = true

        make_forest()
    })

    pub_sub.ui.sub("ui_toggle_action_plant_trees", () =>
    {
        protected_trees = false

        tree_nodes.forEach(tree =>
        {
            const scale = Vector3.One().scale(planted_tree_size)
            tree.getChildMeshes().forEach(mesh => mesh.scaling = scale.clone())
        })

        if (animated) return
        animated = true

        make_forest()
    })


    function make_forest ()
    {
        resize_ground(forest_size_m + ground_size)

        grow_forest()
        // create_ground_mist(scene, ground_size * 0.45, Density.mediumlight)

        setTimeout(() =>
        {
            retarget_and_move_camera_to_include_mesh(scene, camera, ground)
        }, 1000)


        const green = new Color4(0.3, 0.5, 0.25, 0.8)
        let showing_arrows: AbstractMesh[] = []

        pub_sub.ui.sub("ui_toggle_show_tree_CO2_absorbed", () =>
        {
            if (showing_arrows.length)
            {
                showing_arrows.forEach(arrow => arrow.dispose())
                showing_arrows = []
                return
            }

            // trees.forEach((tree, i) =>
            // {
            //     const arrow_args: CreateArrowArgs = {
            //         position: tree.position.add(new Vector3(0, 10, 0)),
            //         color: green,
            //         rotation: [Math.PI, 0, 0],
            //         volume_m3: protected_trees ? tree.size : planted_tree_size,
            //     }

            //     const result = create_arrow_chain(scene, "tree_CO2_absorbed_" + i, arrow_args, { number_of_arrows: 1 })
            //     result.play()
            //     showing_arrows = [...showing_arrows, ...result.arrows]
            // })
        })
    }


    ui_show_name(scene, name)
    ui_show_stats(scene, gas_m3_per_year_value)

    listen_for_double_click(scene, camera, tree_nodes[0])
}



interface SanitiseGasParams
{
    gas_period: string
    gas_volume: number
    gas_units: string
}
function sanitise_gas_params (args: SanitiseGasParams): ValueOrError<TemporalRangeValue>
{
    const { gas_period, gas_volume, gas_units } = args

    let value: TemporalRangeValue | undefined = undefined

    const days = time_period_to_days(gas_period)
    if (days.value === undefined) return { value, error: days.error }
    const units = sanitise_gas_volume_units(gas_units)
    if (units.value === undefined) return { value, error: units.error }


    const date_to = new Date()
    const date_from = subtract_days_from_date(date_to, days.value)


    value = {
        value: gas_volume,
        units: units.value,
        date_from,
        date_to,
    }

    return { value, error: "" }
}



function sanitise_gas_volume_units (volume_units: string): ValueOrError<UnitsID>
{
    volume_units = volume_units.toLowerCase()

    let { value, error } = sanitise_volume_units(volume_units)

    if (!value)
    {
        if (volume_units === "kwh") value = UnitsID.energy_kWh
        else
        {
            error = `Unsupported gas volume units: "${volume_units}"`
        }
    }

    return { value, error }
}



function sanitise_volume_units (volume_units: string): ValueOrError<UnitsID>
{
    volume_units = volume_units.toLowerCase()

    let value = UnitsID.undefined
    let error = ""

    if (volume_units === "m3") value = UnitsID.volume_normal_m3
    else if (volume_units === "ft3") value = UnitsID.volume_normal_cubic_feet
    else
    {
        error = `Unsupported volume units: "${value}"`
    }

    return { value, error }
}



function calculate_gas_m3_per_year (sanitised_gas_params: TemporalRangeValue): ValueOrError<TemporalRangeValue>
{
    let value: TemporalRangeValue | undefined = sanitised_gas_params
    let error = ""

    if (value.units !== UnitsID.volume_normal_m3)
    {
        ({ value, error } = convert_value(value, UnitsID.volume_normal_m3))
        if (value === undefined) return { value, error }
    }

    value = scale_to_approximately_a_year(value)

    return { value, error }
}
