import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchInput from '../../SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedUsersTab, getUsersFilter } from '@/redux/user/userSelector';
import { getUsers, setUsersFilters } from '@/redux/user/userSlice';
import { USER_TABS } from '@/utils/helper';

const UsersSearch = () => {
  const dispatch = useDispatch();
  const selectedUsersTab = useSelector(getSelectedUsersTab);
  const usersFilter = useSelector(getUsersFilter);
  const tabName = USER_TABS[selectedUsersTab];
  const currentUserFilter = usersFilter[tabName];

  const debounceTimerRef = useRef(null);
  const [searchText, setSearchText] = useState(currentUserFilter.search ?? '');

  useEffect(() => {
    setSearchText(currentUserFilter?.search ?? '');
  }, [currentUserFilter?.search]);

  const debouncedSearch = useCallback(
    e => {
      setSearchText(e.target.value);
      if (e.target.value.length === 0) {
        dispatch(
          setUsersFilters({
            key: USER_TABS[selectedUsersTab],
            value: {
              search: null,
              page: 1,
            },
          }),
        );
        dispatch(getUsers({ search: null, page: 1 }));
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
          setUsersFilters({
            key: USER_TABS[selectedUsersTab],
            value: {
              search: e?.target?.value,
              page: 1,
            },
          }),
        );
        dispatch(
          getUsers({
            search: e.target.value ?? null,
            page: 1,
          }),
        );
      }, 500);
    },
    [dispatch, selectedUsersTab],
  );

  return <SearchInput value={searchText} onChange={debouncedSearch} />;
};

export default UsersSearch;
