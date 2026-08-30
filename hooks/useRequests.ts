import { useState, useEffect } from 'react';
import { requests as mockRequests } from '@/data/requests';
import { ServiceRequest } from '@/types/request';

export const useRequests = () => {
  const [requestList, setRequestList] = useState<ServiceRequest[]>(mockRequests);
  const [loading, setLoading] = useState(false);

  const addRequest = (newReq: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => {
    const created: ServiceRequest = {
      ...newReq,
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setRequestList((prev) => [created, ...prev]);
    return created;
  };

  return {
    requests: requestList,
    loading,
    addRequest,
  };
};

export default useRequests;
