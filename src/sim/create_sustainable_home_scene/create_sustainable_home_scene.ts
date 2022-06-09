import { Camera, Color4, Vector3 } from "@babylonjs/core"
import { AdvancedDynamicTexture } from "@babylonjs/gui"

import { create_forest } from "../../components/create_forest"
import { create_gas_bubble } from "../../components/create_gas_bubble"
import { create_ground } from "../../components/create_ground"
import { create_house } from "../../components/create_house"
import { create_missing_area_visual, MissingVisualArea } from "../../components/create_missing_area_visual"
import { person_mesh_names, create_person } from "../../components/create_person"
import { create_sky } from "../../components/create_sky"
import { create_smoke_plume } from "../../components/create_smoke_plume"
import { time_period_to_days, scale_to_approximately_a_year, sanitise_time_period } from "../../data_support/datetime/range"
import { subtract_days_from_date } from "../../data_support/datetime/subtract"
import { convert_value } from "../../data_support/units/convert"
import { TIME_PERIODS, UnitsID, VOLUME_UNITS } from "../../data_support/units/units"
import { TemporalRangeValue } from "../../data_support/value"
import { ValueOrError } from "../../data_support/value_or_error"
import { change_camera_angle, retarget_and_move_camera_to_include_mesh } from "../../utils/move_camera"
import { pub_sub } from "../../utils/pub_sub"
import { shuffle } from "../../utils/random"
import { ui_make_edge_scroll } from "../../utils/ui/ui_make_edge_scroll"
import { URLParams, get_url_param, get_url_param_number } from "../../utils/url_params_parser"
import { vec3 } from "../../utils/vector"
import { ContentCommonArgs } from "../content"
import { listen_for_double_click } from "./listen_for_double_click"
import { ui_show_name } from "./ui/ui_show_name"
import { ui_show_stats } from "./ui/ui_show_stats"



export const create_sustainable_home_scene = ({ scene, camera, shadow_generator}: ContentCommonArgs, ground_size: number, url_params: URLParams) =>
{
    create_sky(scene)

    const params = {
        gas_period: sanitise_time_period(get_url_param(url_params, "gas_period", TIME_PERIODS.month)),
        gas_volume: get_url_param_number(url_params, "gas", 140),
        gas_units: get_url_param(url_params, "gas_units", VOLUME_UNITS.m3),
        name: get_url_param(url_params, "name", ""),
        home_footprint_m2: get_url_param_number(url_params, "home_footprint_m2", 50),
        home_property_m2: get_url_param_number(url_params, "home_property_m2", 100),
        forest_kg_co2_per_m2_per_year: get_url_param_number(url_params, "forest_co2_absorb", 0.171),
        mangrove_kg_co2_per_m2_per_year: get_url_param_number(url_params, "mangrove_co2_absorb", 1.232),
        peatland_kg_co2_per_m2_per_year: get_url_param_number(url_params, "peatland_co2_absorb", 0.123),
    }

    const ok_params: {[k in keyof typeof params]: Exclude<(typeof params[k])["value"], undefined>} = {} as any

    let failure = false
    ;(Object.keys(params) as (keyof typeof params)[]).forEach(key =>
    {
        const result = params[key]

        if (result.value === undefined || Number.isNaN(result.value))
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



    // Assume you can not use roof and assume you can use all land right up to next of property
    // (clearly not true as some tree roots known to damage properties with weak or small foundations)
    const personal_land_area_m2 = home_property_m2 - home_footprint_m2
    // 27.8 million homes according to https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/internationalmigration/articles/housingandhomeownershipintheuk/2015-01-22
    const all_country_land_area_per_home_m2 = (242495 * 1000000) / (27.8 * 1000000)
    // https://www.sheffield.ac.uk/news/nr/land-cover-atlas-uk-1.744440
    // 0.098 = (5.1 + 2.2 + 1.4 + 1.1) existing forest
    const existing_forest_country_land_area_per_home_m2 = all_country_land_area_per_home_m2 * 0.098
    // 1.5% is water according to https://en.wikipedia.org/wiki/United_Kingdom
    // 6% is built on according to https://www.sheffield.ac.uk/news/nr/land-cover-atlas-uk-1.744440
    // 9.4% is peat bogs on according to https://www.sheffield.ac.uk/news/nr/land-cover-atlas-uk-1.744440
    // 0.831 = 100 - (1.5 + 6 + 9.4)
    const max_forestable_country_land_area_per_home_m2 = all_country_land_area_per_home_m2 * 0.831
    // 0.861 = 100 - (1.5 + (6 * 0.5) + 9.4) // assuming 50 of land in developed areas could be used for "energy crops / forestry"
    const existing_forest_city_plus_country_land_area_per_home_m2 = all_country_land_area_per_home_m2 * 0.861



    const forest_position = new Vector3(-5, 0, -5)
    const kg_CO2_per_year = gas_m3_per_year_value.value
    const forest_m2 = kg_CO2_per_year / forest_kg_co2_per_m2_per_year
    console.log("forest_m2", forest_m2)
    const forest_size_m = Math.round(Math.pow(forest_m2, 0.5))
    // const forest_size_m = Math.round(Math.pow(land_area_m2, 0.5))
    let { tree_nodes, play: grow_forest } = create_forest(scene, shadow_generator, forest_position, forest_size_m)

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




    const ground_position = vec3([ground_size / 2, -0.5, ground_size / 2])
    const { ground, resize_ground } = create_ground(scene, ground_size, ground_position)


    const people = shuffle(person_mesh_names)
    create_person(scene, shadow_generator, new Vector3(-4, 0, 3), people[0])
    create_person(scene, shadow_generator, new Vector3(0, 0, 5), people[1])
    create_person(scene, shadow_generator, new Vector3(2, 0, 4), people[2])
    create_house(scene, shadow_generator, Vector3.Zero(), "house")

    const { play } = create_smoke_plume(scene, { emit_position1: new Vector3(0.5, 4.2, -1.9) }, shadow_generator)
    play()




    let animated_forest = false
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

        if (animated_forest) return
        animated_forest = true

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

        if (animated_forest) return
        animated_forest = true

        make_forest()
    })


    function make_forest ()
    {
        resize_ground(forest_size_m + ground_size)

        // create_ground_mist(scene, ground_size * 0.45, Density.mediumlight)

        setTimeout(() =>
        {
            retarget_and_move_camera_to_include_mesh(scene, camera, ground)
            setTimeout(() => grow_forest(), 1000)
        }, 50)
    }


    pub_sub.ui.sub("ui_toggle_show_tree_CO2_absorbed", () =>
    {
    })


    let current_missing_forest_area_constraint_type = ""
    let current_missing_forest_area_available_land_area_m2 = 0
    const missing_forest_area_visual = create_missing_area_visual(scene, forest_position, current_missing_forest_area_available_land_area_m2, forest_m2, { height: 8, base_height: 8 })
    missing_forest_area_visual.toggle_visible() // immediately hide it

    function factory_handle_toggle_show_forest_area_constraint (constraint_type: string, available_land_area_m2: number)
    {
        return () =>
        {
            const hiding_current_type = !!current_missing_forest_area_constraint_type && current_missing_forest_area_constraint_type === constraint_type

            // Make it visible when not visible
            if (!missing_forest_area_visual.is_visible()) missing_forest_area_visual.toggle_visible()
            // When we already have something visible and it is unchanged, then hide it
            else if (hiding_current_type)
            {
                missing_forest_area_visual.toggle_visible()
                current_missing_forest_area_constraint_type = ""
            }


            if (missing_forest_area_visual.is_visible())
            {
                current_missing_forest_area_constraint_type = constraint_type
                const changing_available_land_area_m2 = current_missing_forest_area_available_land_area_m2 !== available_land_area_m2
                current_missing_forest_area_available_land_area_m2 = available_land_area_m2
                change_camera_angle(scene, camera, { alpha: Math.PI/2, beta: 0 })

                if (changing_available_land_area_m2) missing_forest_area_visual.update_bounding_area_m2(available_land_area_m2)
            }
        }
    }

    pub_sub.ui.sub("ui_toggle_show_forest_area_constraint_personal_property_area", factory_handle_toggle_show_forest_area_constraint("personal", personal_land_area_m2))
    pub_sub.ui.sub("ui_toggle_show_forest_area_constraint_existing_forest_country_area", factory_handle_toggle_show_forest_area_constraint("existing_forest", existing_forest_country_land_area_per_home_m2))
    pub_sub.ui.sub("ui_toggle_show_forest_area_constraint_max_forestable_country_area", factory_handle_toggle_show_forest_area_constraint("max_forestable", max_forestable_country_land_area_per_home_m2))
    pub_sub.ui.sub("ui_toggle_show_forest_area_constraint_max_forestable_city_plus_country_area", factory_handle_toggle_show_forest_area_constraint("existing_forest_city_plus", existing_forest_city_plus_country_land_area_per_home_m2))


    const ui_full_screen_advanced_texture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene)
    ui_show_name(ui_full_screen_advanced_texture, name)
    ui_show_stats(scene, gas_m3_per_year_value)
    // ui_make_edge_scroll(camera, ui_full_screen_advanced_texture)

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

    if (volume_units === VOLUME_UNITS.m3) value = UnitsID.volume_normal_m3
    else if (volume_units === VOLUME_UNITS.ft3) value = UnitsID.volume_normal_cubic_feet
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
