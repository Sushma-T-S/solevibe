import { globalApi } from '../services/api'
import { createEntityAdapter } from '@reduxjs/toolkit/query'

// Optional global entities if needed beyond RTK Query cache
export const globalAdapter = createEntityAdapter()

export const globalSlice = (builder) => ({
  // Additional global reducers/mutations here
})

export default globalApi
