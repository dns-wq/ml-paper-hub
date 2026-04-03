import { useState, useEffect } from 'react';
import Storage from '../services/storage.js';

export default function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => Storage.get(key, defaultValue));

  useEffect(() => {
    Storage.set(key, state);
  }, [key, state]);

  return [state, setState];
}
