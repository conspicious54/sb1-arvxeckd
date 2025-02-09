export interface ApiResponse {
  success: boolean;
  error?: any;
  offers: Offer[] | null;
}

export interface Offer {
  offerid: number;
  name: string;
  name_short: string;
  description: string;
  adcopy: string;
  picture: string;
  payout: string;
  country: string;
  device: string;
  link: string;
  epc: string;
}

export interface RewardOption {
  amount: number;
  points: number;
  doublePoints?: boolean;
  limitedTime?: boolean;
}