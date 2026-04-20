import { useState, useEffect } from 'react';
import type { Automation } from '@/types';
import { fetchAutomations } from '@/api/mock';

export function useAutomations() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomations()
      .then(setAutomations)
      .finally(() => setLoading(false));
  }, []);

  return { automations, loading };
}
