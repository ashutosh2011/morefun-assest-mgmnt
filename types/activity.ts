export interface Activity {
  id: string;
  action: string;
  details?: string;
  createdAt: Date;
  user: {
    fullName: string;
  };
  asset?: {
    assetName: string;
  };
} 