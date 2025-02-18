import { 
  useQuery, 
  useMutation, 
  UseQueryOptions, 
  UseMutationOptions,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ApiError, ApiResponse } from '@/types'

export function useApiQuery<T>(
  key: QueryKey,
  fetcher: () => Promise<ApiResponse<T>>,
  options?: Omit<UseQueryOptions<ApiResponse<T>, AxiosError<ApiError>, T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<T>, AxiosError<ApiError>, T>({
    queryKey: key,
    queryFn: fetcher,
    ...options,
  })
}

export function useApiMutation<T, V>(
  mutationFn: (variables: V) => Promise<ApiResponse<T>>,
  options?: Omit<UseMutationOptions<ApiResponse<T>, AxiosError<ApiError>, V>, 'mutationFn'>
) {
  return useMutation<ApiResponse<T>, AxiosError<ApiError>, V>({
    mutationFn,
    ...options,
  })
}

// Helper hook for pagination
export function usePaginatedApiQuery<T>(
  key: QueryKey,
  fetcher: (page: number) => Promise<ApiResponse<T>>,
  page: number,
  options?: Omit<UseQueryOptions<ApiResponse<T>, AxiosError<ApiError>, T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<T>, AxiosError<ApiError>, T>({
    queryKey: [...key, page],
    queryFn: () => fetcher(page),
    ...options,
  })
}

// Helper hook for infinite scrolling
export function useInfiniteApiQuery<T>(
  key: QueryKey,
  fetcher: (page: number) => Promise<ApiResponse<T>>,
  options?: Omit<UseInfiniteQueryOptions<ApiResponse<T>, AxiosError<ApiError>, T>, 'queryKey' | 'queryFn'>
) {
  return useInfiniteQuery<ApiResponse<T>, AxiosError<ApiError>, T>({
    queryKey: key,
    queryFn: ({ pageParam = 1 }) => fetcher(pageParam as number),
    getNextPageParam: (_lastPage, allPages) => allPages.length + 1,
    initialPageParam: 1,
    ...options,
  })
} 