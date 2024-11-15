export const AssetUsageStatus = {
    IN_USE: 'IN_USE',
    IDLE: 'IDLE',
    SCRAPPED: 'SCRAPPED'
  } as const;
  
  export const ScrapRequestStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
  } as const;
  
  export const ApprovalStatus = {
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
  } as const;