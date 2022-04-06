import { Color4, Tools, Vector3 } from "@babylonjs/core"
import { AdvancedDynamicTexture, TextBlock, StackPanel, Control, Slider, } from "@babylonjs/gui"

import { create_gas_bubble } from "../../components/create_gas_bubble"
import { create_ground } from "../../components/create_ground"
import { create_house } from "../../components/create_house"
import { create_person } from "../../components/create_person"
import { create_sky } from "../../components/create_sky"
import { create_smoke_plume } from "../../components/create_smoke_plume"
import { scale_to_approximately_a_month, time_period_to_days } from "../../data_support/datetime/range"
import { days_range, subtract_days_from_date } from "../../data_support/datetime/subtract"
import { convert_value } from "../../data_support/units/convert"
import { UnitsID } from "../../data_support/units/units"
import { TemporalRangeValue } from "../../data_support/value"
import { ValueOrError } from "../../data_support/value_or_error"
import { get_url_param, get_url_param_number, URLParams } from "../../utils/url_params_parser"
import { CreateContentCommonArgs } from "../content"
import { ui_show_name } from "./ui/ui_show_name"



export const create_sustainable_home_scene = ({ scene, shadow_generator}: CreateContentCommonArgs, ground_size: number, url_params: URLParams) =>
{
    create_sky(scene)
    create_ground(scene, ground_size)
    const gas = create_gas_bubble(scene, { position: new Vector3(-5, 5, 0), volume_m3: 1, color: new Color4(0.25, 0.3, 0.5, 0.8), shadow_generator })
    gas.play()

    create_person(scene, shadow_generator, new Vector3(0, 0, 4))
    create_house(scene, shadow_generator, Vector3.Zero(), "house")

    const { play } = create_smoke_plume(scene, { emit_position1: new Vector3(-0.5, 4.2, -1.9) }, shadow_generator)
    play()


    const gas_period = get_url_param(url_params, "gas_period")
    const gas_volume = get_url_param_number(url_params, "gas")
    const gas_units = get_url_param(url_params, "gas_units")
    const name = get_url_param(url_params, "name")

    if (gas_volume.error)
    {
        console.error("Error in gas_volume param", gas_volume.error)
        return
    }

    const sanitised_gas_params = sanitise_gas_params({ gas_period, gas_volume: gas_volume.value, gas_units })
    if (sanitised_gas_params.value === undefined)
    {
        console.error("Error in gas params", sanitised_gas_params.error)
        return
    }


    const gas_m3_per_month = calculate_gas_m3_per_month(sanitised_gas_params.value)
    if (gas_m3_per_month.value === undefined)
    {
        console.error("Error converting gas to m3 per month", gas_m3_per_month.error)
        return
    }
    const gas_m3_per_month_value = gas_m3_per_month.value


    ui_show_name(scene, name)


    setTimeout(() => gas.grow(gas_m3_per_month_value.value), 1000)
}



interface CalculateGasM3PerMonth
{
    gas_period: string
    gas_volume: number
    gas_units: string
}
function sanitise_gas_params (args: CalculateGasM3PerMonth): ValueOrError<TemporalRangeValue>
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



function calculate_gas_m3_per_month (sanitised_gas_params: TemporalRangeValue): ValueOrError<TemporalRangeValue>
{
    let value: TemporalRangeValue | undefined = sanitised_gas_params
    let error = ""

    if (value.units !== UnitsID.volume_normal_m3)
    {
        ({ value, error } = convert_value(value, UnitsID.volume_normal_m3))
        if (value === undefined) return { value, error }
    }

    value = scale_to_approximately_a_month(value)

    return { value, error }
}
