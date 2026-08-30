import { ServiceRequest } from '@/types/request';

export const requests: ServiceRequest[] = [
  {
    id: 'REQ-1049',
    categoryName: 'Television & Audio',
    brandName: 'Sony',
    productName: '65 inch BRAVIA OLED',
    issueDescription: 'Display panel has horizontal lines after lightning storm',
    preferredDate: 'Tomorrow',
    preferredTime: '11:00 AM',
    status: 'quoted',
    estimatedQuote: 1200,
    createdAt: '2026-08-29',
  },
  {
    id: 'REQ-1012',
    categoryName: 'Electrical Services',
    issueDescription: 'Main circuit breaker tripping repeatedly when AC turns on',
    preferredDate: '26 Aug 2026',
    preferredTime: '04:00 PM',
    status: 'completed',
    estimatedQuote: 350,
    createdAt: '2026-08-26',
  },
];

export default requests;
