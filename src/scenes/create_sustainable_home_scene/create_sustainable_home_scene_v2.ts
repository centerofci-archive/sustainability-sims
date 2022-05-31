
import { create_sky } from "../../components/create_sky"
import { URLParams } from "../../utils/url_params_parser"
import { CreateContentCommonArgs } from "../content"
import { create_state_machine, LightState, LightTransition, StateMachine } from "./state/create_state_machine"



export const create_sustainable_home_scene_v2 = ({ scene, camera, shadow_generator}: CreateContentCommonArgs, ground_size: number, url_params: URLParams) =>
{
    create_sky(scene)

    const state_machine = create_state_machine()

    setup_light(state_machine)
    setup_lightswitch(state_machine)

    // const is_revisiting = determine_if_revisiting()

    // show_home_selector()

    state_machine.start()
}



function setup_light (state_machine: StateMachine)
{
    state_machine.subscribe(e =>
    {
        window.document.body.innerText = e.value.new
    })
}


function setup_lightswitch (state_machine: StateMachine)
{
    ;(window as any).switch_on = () =>
    {
        state_machine.transition(LightTransition.TurnOn)
    }

    ;(window as any).switch_off = () =>
    {
        state_machine.transition(LightTransition.TurnOff)
    }
}
