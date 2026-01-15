import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../config/axios';

//get all public listing

export const getAllPublicListing = createAsyncThunk("listing/getAllPublicListing" , 
    async ()=>{
       try {
        const { data } = await api.get('/api/listing/public')
        return data;
       } catch (error) {
         console.log(error);
         return [];
       }
    }
)

//Get all user listings
export const getAllUserListing = createAsyncThunk("listing/getAllUserListing" ,
    async ({getToken}) => {
        try {
            const token = await getToken();
            const {data} = await api.get('api/listing/user' , 
              {headers : { Authorization : `Bearer ${token}`}}) 
              return data
        } catch (error) {
          console.log(error);
          return [];  
        }
    }
)


const listingSlice = createSlice({
    name: 'listings',
    initialState: {
        listings: [],
        userListings:[],
        balance:{
            earned:0,
            withdrawn:0,
            available:0,
        } 
    },
    reducers: {
        setListing: (state, action) => {
            state.listings= action.payload;
        }
    },
    
    extraReducers: (builder) => {
        builder.addCase(getAllPublicListing.fulfilled ,
            () => {
              state.listings = action.payload.listings;
        });
        builder.addCase(getAllUserListing.fulfilled ,
            () => {
              state.userListings = action.payload.listings;
              state.balance = action.payload.balance;
        });
    }

});



export const {setListing} = listingSlice.actions;
export default listingSlice.reducer;

