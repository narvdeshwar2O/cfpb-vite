export interface FpiResponse<T = Record<string, unknown>> {
  success: boolean;
  data: T[];
  filters?: Record<string, unknown>;
  where_str?: string;
}
