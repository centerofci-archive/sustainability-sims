import { RootState } from "./state"
import { get_store } from "./store"



type ConnectedComponent<StateProps extends { show: boolean }, LocalProps extends Exclude<{}, StateProps>> = {
    map_state: (state: RootState) => StateProps
    initial_local?: () => LocalProps
    render: (props: StateProps & LocalProps) => void
    update: (props: StateProps & LocalProps) => void
    dispose: (props: StateProps & LocalProps) => void
}
export type ConnectedableComponent<StateProps extends { show: boolean }, LocalProps extends Exclude<{}, StateProps>> = (update_local: (new_local: Partial<LocalProps>) => void) => ConnectedComponent<StateProps, LocalProps>



export function connect <StateProps extends { show: boolean }, LocalProps extends Exclude<{}, StateProps>> (component: ConnectedableComponent<StateProps, LocalProps>)
{
    const last: { state_props: StateProps, local_props: LocalProps } = {
        state_props: { show: false } as StateProps,
        local_props: {} as LocalProps,
    }


    function update_local (new_local: Partial<LocalProps>)
    {
        last.local_props = { ...last.local_props, ...new_local }

        const new_props = { ...last.state_props, ...last.local_props }
        process_new_props(new_props)
    }


    const connected_component = component(update_local)

    if (connected_component.initial_local) last.local_props = connected_component.initial_local()


    const store = get_store()
    store.subscribe(() =>
    {
        const new_state = store.getState()
        last.state_props = connected_component.map_state(new_state)
        const new_props = { ...last.state_props, ...last.local_props }
        process_new_props(new_props)
    })


    let last_props = { ...last.local_props, ...last.state_props } as (StateProps & LocalProps)

    function process_new_props (new_props: StateProps & LocalProps)
    {
        const props_changed = shallow_diff(last_props, new_props)

        if (props_changed)
        {
            if (new_props.show)
            {
                if (!last_props.show) connected_component.render(new_props)
                else connected_component.update(new_props)
            }
            else
            {
                if (last_props.show) connected_component.dispose(new_props)
                else {} // no-op
            }
        }

        last_props = new_props
    }
}



function shallow_diff <P extends object> (obj1: P, obj2: P)
{
    const keys = Object.keys({ ...obj1, ...obj2 })

    for (let i = 0; i < keys.length; ++i)
    {
        const key = keys[i]
        if ((obj1 as any)[key] !== (obj2 as any)[key]) return true
    }

    return false
}



export function connect_dispatch <D extends object> (map: D): D
{
    const store = get_store()

    const new_map = {...map}

    Object.entries(new_map).forEach(([key, value]) =>
    {
        ;(new_map as any)[key] = (...args: any[]) =>
        {
            store.dispatch(value(...args))
        }
    })

    return new_map
}
