import { Action, Store } from "@reduxjs/toolkit"

import { SustainableHomeRootState } from "./state"



export type SustainableHomeStoreType = Store<SustainableHomeRootState, Action<any>> & { load_state_from_storage: boolean }
