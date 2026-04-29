import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const globalApi = createApi({
  reducerPath: 'globalApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/',
    prepareHeaders: (headers) => {
      // Add auth token from cookies/localStorage if needed
      return headers
    }
  }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => 'api/category/get',
      transformResponse: (response) => response.data.sort((a, b) => a.name.localeCompare(b.name))
    }),
    getSubCategories: builder.query({
      query: () => 'api/subcategory/get',
      transformResponse: (response) => response.data.sort((a, b) => a.name.localeCompare(b.name))
    })
  })
})

export const { useGetCategoriesQuery, useGetSubCategoriesQuery } = globalApi
