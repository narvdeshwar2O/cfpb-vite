export interface StateDistrictMasterResponse {
  success: boolean;
  data: Record<string, string[]>;
}

export interface CountryMasterResponse {
  success: boolean;
  data: { country: string }[];
}
