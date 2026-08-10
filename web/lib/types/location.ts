export interface CountryResponse {
  id: number;
  name: string;
  codeAlpha2: string;
}

export interface StateResponse {
  id: number;
  name: string;
  countryId: number;
}

export interface CityResponse {
  id: number;
  name: string;
  stateId: number;
}
