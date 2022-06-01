import { CreateContentCommonArgs } from "../../content"
import { RootState } from "./state"
import { get_store } from "./store"



type ConnectedComponent<P extends { show: boolean }> = {
    map_state: (state: RootState) => P,
    render: (props: P) => void
    update: (props: P) => void
    dispose: (props: P) => void
}
export type ConnectedableComponent<P extends { show: boolean }> = (args: CreateContentCommonArgs) => ConnectedComponent<P>



export function connect <P extends { show: boolean }> (component: ConnectedComponent<P>)
{
    const store = get_store()

    let last_props = { show: false } as P
    store.subscribe(() =>
    {
        const new_state = store.getState()
        const new_state_props = component.map_state(new_state)
        const new_props = new_state_props
        const props_changed = shallow_diff(last_props, new_props)

        if (props_changed)
        {
            if (new_props.show)
            {
                if (!last_props.show) component.render(new_props)
                else component.update(new_props)
            }
            else
            {
                if (last_props.show) component.dispose(new_props)
                else {} // no-op
            }
        }

        last_props = new_props
    })
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
