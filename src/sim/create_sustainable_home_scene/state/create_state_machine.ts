import { createMachina } from "xmachina"



export enum LightState
{
    On = "On",
    Off = "Off",
}

export enum LightTransition
{
    TurnOff = "TurnOff",
    TurnOn = "TurnOn",
}


export function create_state_machine ()
{
    const machina = createMachina<LightState, LightTransition>(LightState.On)
    .addState(LightState.On, {
        on: LightTransition.TurnOff,
        nextState: LightState.Off,
        description: "turn off light switch",
    })
    .addState(LightState.Off, {
        on: LightTransition.TurnOn,
        nextState: LightState.On,
        description: "turn on light switch",
    })
    .build()

    return machina
}



export type StateMachine = ReturnType<typeof create_state_machine>
