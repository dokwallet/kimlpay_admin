import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchInput from '../../SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import { getPayoutFilter } from '@/redux/payout/payoutSelectors';
import { getPayout, setPayoutFilters } from '@/redux/payout/payoutSlice';

const PayoutSearch = () => {
  const dispatch = useDispatch();
  const affiliateUserFilter = useSelector(getPayoutFilter);
  const debounceTimerRef = useRef(null);
  const [searchText, setSearchText] = useState(
    affiliateUserFilter.search ?? '',
  );

  useEffect(() => {
    setSearchText(affiliateUserFilter?.search ?? '');
  }, [affiliateUserFilter?.search]);

  const debouncedSearch = useCallback(
    e => {
      setSearchText(e.target.value);
      if (e.target.value.length === 0) {
        dispatch(
          setPayoutFilters({
            search: null,
            page: 1,
          }),
        );
        dispatch(getPayout({ search: null, page: 1 }));
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
          setPayoutFilters({
            search: e.target.value,
            page: 1,
          }),
        );
        dispatch(
          getPayout({
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

export default PayoutSearch;
