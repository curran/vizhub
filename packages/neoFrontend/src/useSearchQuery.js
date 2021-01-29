import { useLocation } from 'react-router';

const toObject = (searchParams) => {
  return Array.from(searchParams.entries()).reduce(
    (params, [key, value]) => (params[key] = value) && params,
    {}
  );
};

export const useSearchQuery = (key, defaultValue = '') => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  return key ? searchParams.get(key) || defaultValue : toObject(searchParams);
};
