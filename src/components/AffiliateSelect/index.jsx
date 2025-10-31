import React, { useCallback, useMemo, useRef, useState } from 'react';

import SelectWithSearch from '@/components/selectWithSearch';
import { getAffiliateUsersAPI, getPublicAffiliateUsersAPI } from '@/apis/apis';

const AffiliateSelect = ({
  affiliateUserDetails,
  selectedAffiliateUser,
  onChangeAffiliate,
  isPublic,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);
  const isFetchingMore = useRef(null);
  const totalSearchedData = useRef(null);
  const [searchData, setSearchData] = useState(null);

  const affiliateUserOptions = useMemo(() => {
    const mapFunction = ({ _id, name, username }) => ({
      id: _id,
      name,
      label: name,
      username,
    });
    return searchData
      ? searchData.map(mapFunction)
      : affiliateUserDetails?.map(mapFunction);
  }, [affiliateUserDetails, searchData]);

  const selectedAffiliate = useMemo(() => {
    if (selectedAffiliateUser?._id) {
      const user = affiliateUserOptions?.find(
        item => item.id === selectedAffiliateUser?._id,
      );
      const defaultUser = {
        id: selectedAffiliateUser?._id,
        name: selectedAffiliateUser?.name,
        label: selectedAffiliateUser?.name,
      };

      return user?.id ? user : defaultUser;
    }
    return null;
  }, [
    affiliateUserOptions,
    selectedAffiliateUser?._id,
    selectedAffiliateUser?.name,
  ]);
  const [selectedOptions, setSelectedOptions] = useState(selectedAffiliate);
  const [searchText, setSearchText] = useState(selectedOptions?.name);

  const onChange = useCallback(
    value => {
      setSelectedOptions(value);
      setSearchText(value?.name || '');
      onChangeAffiliate?.(value);
    },
    [onChangeAffiliate],
  );

  const onEndReached = useCallback(async () => {
    try {
      if (
        searchData &&
        searchData?.length < totalSearchedData.current &&
        !isFetchingMore.current
      ) {
        setIsLoading(true);
        isFetchingMore.current = true;
        const payload = {
          page: Math.floor(searchData.length / 20) + 1,
          limit: 20,
          search: searchText?.trim(),
        };
        const resp = isPublic
          ? await getPublicAffiliateUsersAPI(payload)
          : await getAffiliateUsersAPI(payload);
        const items = resp?.data?.items;
        if (Array.isArray(items)) {
          setSearchData(prevState => [...prevState, ...items]);
        }
        isFetchingMore.current = false;
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Error in fetching more');
      setIsLoading(false);
      isFetchingMore.current = false;
    }
  }, [isPublic, searchData, searchText]);

  const handleSearchAffiliateUser = useCallback(
    (event, _, reason) => {
      try {
        const value = event?.target?.value;
        if (reason === 'reset' || value === '') {
          setSearchData(null);
          setSearchText(selectedOptions?.name);
          clearTimeout(timerRef.current);
          setIsLoading(false);
          return;
        }
        if (typeof value !== 'string') {
          return;
        }
        setSearchText(value);
        setIsLoading(true);
        if (timerRef?.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(async () => {
          const payload = {
            page: 1,
            limit: 20,
            search: value?.trim(),
          };
          const resp = isPublic
            ? await getPublicAffiliateUsersAPI(payload)
            : await getAffiliateUsersAPI(payload);
          const items = resp?.data?.items;
          totalSearchedData.current = resp?.data?.meta?.totalItems;
          if (Array.isArray(items)) {
            setSearchData(items);
          }
          setIsLoading(false);
        }, 1000);
      } catch (e) {
        console.error('Error in search', e);
        setIsLoading(false);
        setSearchData(null);
      }
    },
    [isPublic, selectedOptions?.name],
  );

  return (
    <SelectWithSearch
      height={isPublic ? '48px' : '32px'}
      optionList={affiliateUserOptions}
      loading={isLoading}
      onInputChange={handleSearchAffiliateUser}
      defaultValue={selectedOptions}
      onChange={onChange}
      value={selectedOptions || null}
      inputValue={searchText}
      placeholder={'Select Affiliate'}
      onEndReached={onEndReached}
    />
  );
};

export default AffiliateSelect;
