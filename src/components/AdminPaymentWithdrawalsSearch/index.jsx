import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchInput from '../SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminPaymentWithdrawalsFilter } from '@/redux/adminPaymentWithdrawals/adminPaymentWithdrawalsSelectors';
import {
  getAdminPaymentWithdrawals,
  setAdminPaymentWithdrawalsFilters,
} from '@/redux/adminPaymentWithdrawals/adminPaymentWithdrawalsSlice';

const AdminPaymentWithdrawalsSearch = () => {
  const dispatch = useDispatch();
  const adminPaymentWithdrawalsFilter = useSelector(
    getAdminPaymentWithdrawalsFilter,
  );
  const debounceTimerRef = useRef(null);
  const [searchText, setSearchText] = useState(
    adminPaymentWithdrawalsFilter.search ?? '',
  );

  useEffect(() => {
    (() => {
      setSearchText(adminPaymentWithdrawalsFilter?.search ?? '');
    })();
  }, [adminPaymentWithdrawalsFilter?.search]);

  const debouncedSearch = useCallback(
    e => {
      setSearchText(e.target.value);
      if (e.target.value.length === 0) {
        dispatch(
          setAdminPaymentWithdrawalsFilters({
            search: null,
          }),
        );
        dispatch(getAdminPaymentWithdrawals({ search: null }));
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
          setAdminPaymentWithdrawalsFilters({
            search: e.target.value,
            page: 1,
          }),
        );
        dispatch(
          getAdminPaymentWithdrawals({
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

export default AdminPaymentWithdrawalsSearch;
