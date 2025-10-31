import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchInput from '../../SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import { getAffiliateUserFilter } from '@/redux/affiliateUser/affiliateUserSelector';
import {
  getAllAffiliateUser,
  setAffiliateUserFilters,
} from '@/redux/affiliateUser/affiliateUserSlice';

const AffiliateSearch = () => {
  const dispatch = useDispatch();
  const affiliateUserFilter = useSelector(getAffiliateUserFilter);
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
          setAffiliateUserFilters({
            search: null,
            page: 1,
          }),
        );
        dispatch(getAllAffiliateUser({ search: null, page: 1 }));
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
          setAffiliateUserFilters({
            search: e.target.value,
            page: 1,
          }),
        );
        dispatch(
          getAllAffiliateUser({
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

export default AffiliateSearch;
