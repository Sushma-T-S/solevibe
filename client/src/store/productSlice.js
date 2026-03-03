import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    allCategory : [],
    loadingCategory : false,
    allSubCategory : [],
    allBrand : [],   //  Added
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
        setAllBrand : (state,action)=>{   //  Added
            state.allBrand = [...action.payload]
        },
        SET_ALL_BRAND: (state, action) => {
  state.allBrand = action.payload;
 }
 
    }
})

export const  { 
    setAllCategory,
    setAllSubCategory,
    setLoadingCategory,
    setAllBrand,
    SET_ALL_BRAND      // Export this
} = productSlice.actions

export default productSlice.reducer