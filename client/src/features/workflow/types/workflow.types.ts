export interface WorkflowStatusItem {
  UIFP: number;
  absconder: number;
  arrested: number;
  convicted: number;
  deadbody: number;
  deportee: number;
  externee: number;
  state?: string;
  district?: string;
  police_station?: string;
  suspect: number;
}

export interface WorkflowStatusResponse {
  success: boolean;
  data: WorkflowStatusItem[];
  filters: Record<string, unknown>;
}
