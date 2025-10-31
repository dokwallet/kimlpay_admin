import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchInput from '@/components/SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import { getDepositFilter } from '@/redux/deposit/depositSelectors';
import { getDeposit, setDepositFilters } from '@/redux/deposit/depositSlice';

const DepositSearch = () => {
  const dispatch = useDispatch();
  const affiliateUserFilter = useSelector(getDepositFilter);
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
          setDepositFilters({
            search: null,
            page: 1,
          }),
        );
        dispatch(getDeposit({ search: null, page: 1 }));
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
          setDepositFilters({
            search: e.target.value,
            page: 1,
          }),
        );
        dispatch(
          getDeposit({
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

export default DepositSearch;
