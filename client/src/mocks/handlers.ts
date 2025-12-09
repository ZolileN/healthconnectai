import { http, HttpResponse } from 'msw';

export const handlers = [
  // Add your mock handlers here
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),
  // Add more mock handlers as needed
];