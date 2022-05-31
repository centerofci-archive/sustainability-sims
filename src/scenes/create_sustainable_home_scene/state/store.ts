import { Action, configureStore, Store } from "@reduxjs/toolkit"
import { root_reducer } from "./reducer"
import { get_starting_state } from "./starting_state"
import { RootState } from "./state"



export type StoreType = Store<RootState, Action<any>> & { load_state_from_storage: boolean }
let cached_store: StoreType

interface ConfigStoreArgs
{
    use_cache?: boolean
    override_preloaded_state?: Partial<RootState> | undefined
    load_state_from_storage?: boolean
}
export function get_store (args: ConfigStoreArgs = {}): StoreType
{
    const {
        use_cache = true,
        override_preloaded_state = {},
        load_state_from_storage = false,
    } = args

    if (cached_store && use_cache) return cached_store


    const preloaded_state: RootState = {
        ...get_starting_state(load_state_from_storage),
        ...override_preloaded_state,
    }

    const store = configureStore<RootState, Action>({ preloadedState: preloaded_state, reducer: root_reducer as any }) as StoreType
    cached_store = store

    return store
}
