'use client';
import React from 'react';
import styles from './FilterAndExportButton.module.css';
import { Badge, Box, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExportIcon from '@mui/icons-material/ArrowCircleDownRounded';

const FilterAndExportButton = ({
  onClickFilter,
  onClickExport,
  badgeCount,
  isExpand,
  isExporting,
  hideExportButton,
}) => {
  return (
    <Box className={styles.filtersContainer}>
      {/* <Typography className={styles.switchLabel}>
                <Switch />
                Your transactions
              </Typography> */}
      <Badge badgeContent={badgeCount} color='info'>
        <Button
          className={`${styles.filterButton} ${isExpand ? styles.activeFilter : ''}`}
          startIcon={<FilterListIcon />}
          onClick={onClickFilter}>
          Filters
        </Button>
      </Badge>
      {!hideExportButton && (
        <Button
          disabled={isExporting}
          className={styles.filterButton}
          startIcon={<ExportIcon />}
          onClick={onClickExport}>
          Export
        </Button>
      )}
    </Box>
  );
};

export default FilterAndExportButton;
