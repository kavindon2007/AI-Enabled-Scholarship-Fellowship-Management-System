/**
 * @module api
 * Standard API response envelope used by all Node.js services.
 */

import { z } from 'zod';

/** Error detail returned in the API response envelope */
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.array(z.object({
    field: z.string().optional(),
    message: z.string(),
  })).optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

/** Standard API response envelope: { data, error, meta } */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

/** Helper to create a success response */
export function successResponse<T>(data: T, requestId: string): ApiResponse<T> {
  return {
    data,
    error: null,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  };
}

/** Helper to create an error response */
export function errorResponse(
  code: string,
  message: string,
  requestId: string,
  details?: Array<{ field?: string; message: string }>,
): ApiResponse<null> {
  return {
    data: null,
    error: { code, message, details },
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  };
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}
