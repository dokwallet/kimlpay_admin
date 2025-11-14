import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchInput from '../SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminTelegramUserFilter } from '@/redux/adminTelegramUser/adminTelegramUserSelectors';
import {
  getAdminTelegramUsers,
  setAdminTelegramUserFilters,
} from '@/redux/adminTelegramUser/adminTelegramUserSlice';

const AdminTelegramUsersSearch = () => {
  const dispatch = useDispatch();
  const adminTelegramUserFilter = useSelector(getAdminTelegramUserFilter);
  const debounceTimerRef = useRef(null);
  const [searchText, setSearchText] = useState(
    adminTelegramUserFilter.search ?? '',
  );

  useEffect(() => {
    setSearchText(adminTelegramUserFilter?.search ?? '');
  }, [adminTelegramUserFilter?.search]);

  const debouncedSearch = useCallback(
    e => {
      setSearchText(e.target.value);
      if (e.target.value.length === 0) {
        dispatch(
          setAdminTelegramUserFilters({
            search: null,
          }),
        );
        dispatch(getAdminTelegramUsers({ search: null }));
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
          setAdminTelegramUserFilters({
            search: e.target.value,
            page: 1,
          }),
        );
        dispatch(
          getAdminTelegramUsers({
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

export default AdminTelegramUsersSearch;
