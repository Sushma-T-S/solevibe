import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../utils/Axios.js"
import SummaryApi from "../common/SummaryApi.js"

const initialValue = {
    allCategory : [],
    loadingCategory : false,
    allSubCategory : [],
    loadingSubCategory : false,  // Added
    allBrand : [],   
    product : []
}

const productSlice = createSlice({
    name : 'product',
    initialState : initialValue,
    reducers : {
        setAllCategory : (state,action)=>{
            state.allCategory = [...action.payload]
        },
        setLoadingCategory : (state,action)=>{
            state.loadingCategory = action.payload
        },
        setAllSubCategory : (state,action)=>{
            state.allSubCategory = [...action.payload]
        },
        setLoadingSubCategory : (state,action)=>{  // Added
            state.loadingSubCategory = action.payload
        },
        setAllBrand : (state,action)=>{   
            state.allBrand = [...action.payload]
        },
        SET_ALL_BRAND: (state, action) => {
            state.allBrand = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubCategories.pending, (state) => {
                state.loadingSubCategory = true
            })
            .addCase(fetchSubCategories.fulfilled, (state, action) => {
                state.loadingSubCategory = false
                state.allSubCategory = action.payload
            })
            .addCase(fetchSubCategories.rejected, (state) => {
                state.loadingSubCategory = false
            })
    }
})

// Async thunk to fetch subcategories
export const fetchSubCategories = createAsyncThunk(
    'product/fetchSubCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await Axios({
                ...SummaryApi.getSubCategory
            })
            const { data: responseData } = response
            if (responseData.success) {
                return responseData.data.sort((a, b) => a.name.localeCompare(b.name))
            }
            return rejectWithValue(responseData.message)
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch subcategories')
        }
    }
)

export const { 
    setAllCategory,
    setAllSubCategory,
    setLoadingCategory,
    setLoadingSubCategory,  // Added
    setAllBrand,
    SET_ALL_BRAND
} = productSlice.actions

export default productSlice.reducer
