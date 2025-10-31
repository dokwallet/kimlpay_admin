import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchInput from '../../SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import { getTopupFilter } from '@/redux/topup/topupSelectors';
import { getTopup, setTopupFilters } from '@/redux/topup/topupSlice';

const TopupSearch = () => {
  const dispatch = useDispatch();
  const affiliateUserFilter = useSelector(getTopupFilter);
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
          setTopupFilters({
            search: null,
            page: 1,
          }),
        );
        dispatch(getTopup({ search: null, page: 1 }));
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
          setTopupFilters({
            search: e.target.value,
            page: 1,
          }),
        );
        dispatch(
          getTopup({
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

export default TopupSearch;
