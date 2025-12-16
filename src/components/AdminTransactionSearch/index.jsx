import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchInput from '../SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminTransactionFilter } from '@/redux/adminTransaction/adminTransactionSelectors';
import {
  getAdminTransactions,
  setAdminTransactionFilters,
} from '@/redux/adminTransaction/adminTransactionSlice';

const AdminTransactionSearch = () => {
  const dispatch = useDispatch();
  const adminTransactionFilter = useSelector(getAdminTransactionFilter);
  const debounceTimerRef = useRef(null);
  const [searchText, setSearchText] = useState(
    adminTransactionFilter.search ?? '',
  );

  useEffect(() => {
    (() => {
      setSearchText(adminTransactionFilter?.search ?? '');
    })();
  }, [adminTransactionFilter?.search]);

  const debouncedSearch = useCallback(
    e => {
      setSearchText(e.target.value);
      if (e.target.value.length === 0) {
        dispatch(
          setAdminTransactionFilters({
            search: null,
          }),
        );
        dispatch(getAdminTransactions({ search: null }));
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
          setAdminTransactionFilters({
            search: e.target.value,
            page: 1,
          }),
        );
        dispatch(
          getAdminTransactions({
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

export default AdminTransactionSearch;
