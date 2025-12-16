import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchInput from '../SearchInput';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminLinks,
  setAdminLinkFilters,
} from '@/redux/adminLink/adminLinkSlice';
import { getAdminLinkFilter } from '@/redux/adminLink/adminLinkSelectors';

const AdminLinksSearch = () => {
  const dispatch = useDispatch();
  const adminLinkFilter = useSelector(getAdminLinkFilter);
  const debounceTimerRef = useRef(null);
  const [searchText, setSearchText] = useState(adminLinkFilter.search ?? '');

  useEffect(() => {
    (() => {
      setSearchText(adminLinkFilter?.search ?? '');
    })();
  }, [adminLinkFilter?.search]);

  const debouncedSearch = useCallback(
    e => {
      setSearchText(e.target.value);
      if (e.target.value.length === 0) {
        dispatch(
          setAdminLinkFilters({
            search: null,
          }),
        );
        dispatch(getAdminLinks({ search: null }));
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
          setAdminLinkFilters({
            search: e.target.value,
            page: 1,
          }),
        );
        dispatch(
          getAdminLinks({
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

export default AdminLinksSearch;
