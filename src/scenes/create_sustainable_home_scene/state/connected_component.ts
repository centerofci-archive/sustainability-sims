import { RootState } from "./state"
import { get_store } from "./store"



type ConnectedComponent<P extends object> = { map_state: (state: RootState, last_state: RootState) => P, update: (props: P, last_props: P) => void }
export type ConnectedableComponent<P extends object> = () => ConnectedComponent<P>



export function connect <P extends object> (component: ConnectedComponent<P>)
{
    const store = get_store()

    let last_state = store.getState()
    let last_props: P = {} as any
    store.subscribe(() =>
    {
        const new_state = store.getState()
        const new_props = component.map_state(new_state, last_state)
        const props_changed = shallow_diff(last_props, new_props)

        if (props_changed) component.update(new_props, last_props)

        last_state = new_state
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
