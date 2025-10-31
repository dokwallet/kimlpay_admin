import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchInput from '../../SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import { getShippingFilter } from '@/redux/shipping/shippingSelector';
import {
  getAllShipping,
  setShippingFilters,
} from '@/redux/shipping/shippingSlice';

const ShippingSearch = () => {
  const dispatch = useDispatch();
  const shippingFilter = useSelector(getShippingFilter);
  const debounceTimerRef = useRef(null);
  const [searchText, setSearchText] = useState(shippingFilter.search ?? '');

  useEffect(() => {
    setSearchText(shippingFilter?.search ?? '');
  }, [shippingFilter?.search]);

  const debouncedSearch = useCallback(
    e => {
      setSearchText(e.target.value);
      if (e.target.value.length === 0) {
        dispatch(
          setShippingFilters({
            search: null,
            page: 1,
          }),
        );
        dispatch(getAllShipping({ search: null, page: 1 }));
        return;
      }
      if (e.target.value.length <= 0) {
        return;
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        dispatch(
          setShippingFilters({
            search: e.target.value,
            page: 1,
          }),
        );
        dispatch(
          getAllShipping({
            search: e.target.value ?? null,
            page: 1,
          }),
        );
      }, 500);
    },
    [dispatch],
  );

  return <SearchInput value={searchText} onChange={debouncedSearch} />;
};

export default ShippingSearch;
