// https://stackoverflow.com/questions/68424114/next-js-how-to-fetch-localstorage-data-before-client-side-rendering
// 解决 nextJS 无法获取初始localstorage问题

import { useEffect, useState } from 'react';
import { isSSR } from '@/utils/is';

const getDefaultStorage = (key) => {
  if (!isSSR) {
    return localStorage.getItem(key);
  } else {
    return undefined;
  }
};

function useStorage(
  key: string,
  defaultValue?: any
): [any, (string) => void, () => void] {
  const [storedValue, setStoredValue] = useState(
    getDefaultStorage(key) || defaultValue
  );

  const setStorageValue = (value: any) => {
    if (!isSSR) {
      localStorage.setItem(key, JSON.stringify(value));
      if (value !== storedValue) {
        setStoredValue(value);
      }
    }
  };

  const removeStorage = () => {
    if (!isSSR) {
      localStorage.removeItem(key);
    }
  };

  useEffect(() => {
    const storageValue = localStorage.getItem(key);
    if (storageValue) {
      setStoredValue(storageValue);
    }
  }, []);

  try {
    return [JSON.parse(storedValue), setStorageValue, removeStorage];
  } catch (err) {
    return [storedValue, setStorageValue, removeStorage];
  }
}

export default useStorage;
