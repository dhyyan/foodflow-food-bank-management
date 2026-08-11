import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import type { Item, CreateItemRequest, UpdateItemRequest } from './itemTypes';
import type { ApiResponse } from '../../types/api';

export const itemsApi = createApi({
  reducerPath: 'itemsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Item'],
  endpoints: (builder) => ({
    getItems: builder.query<ApiResponse<Item[]>, void>({
      query: () => '/items',
      providesTags: ['Item'],
    }),
    getItemById: builder.query<ApiResponse<Item>, string>({
      query: (id) => `/items/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Item', id }],
    }),
    createItem: builder.mutation<ApiResponse<Item>, CreateItemRequest>({
      query: (body) => ({
        url: '/items',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Item'],
    }),
    updateItem: builder.mutation<ApiResponse<Item>, UpdateItemRequest>({
      query: ({ id, ...body }) => ({
        url: `/items/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Item', id },
        'Item',
      ],
    }),
    deleteItem: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Item'],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemsApi;
