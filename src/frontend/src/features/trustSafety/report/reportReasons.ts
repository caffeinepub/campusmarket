// Fixed report reasons list
export interface ReportReason {
  id: string;
  label: string;
}

export const REPORT_REASONS: ReportReason[] = [
  { id: 'spam', label: 'Spam or misleading' },
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'scam', label: 'Suspected scam' },
  { id: 'duplicate', label: 'Duplicate listing' },
  { id: 'sold', label: 'Already sold elsewhere' },
  { id: 'other', label: 'Other' },
];
