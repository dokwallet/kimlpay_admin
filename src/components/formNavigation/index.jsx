import React from 'react';
import Button from '../_button';
import LeftIcon from '@mui/icons-material/ChevronLeftRounded';
import RightIcon from '@mui/icons-material/ChevronRightRounded';
import styles from './FormNavigation.module.css';

const FormNavigation = ({
  hasPrevious = false,
  onBackClick,
  isLastStep,
  isLoading,
  disabled,
  isUpdate,
}) => {
  return (
    <div className={styles.formNavigateContainer}>
      {hasPrevious && (
        <Button
          type='button'
          onClick={onBackClick}
          className={styles.backBtn}
          disabled={disabled}>
          <div className='btnIconText'>
            <LeftIcon />
            <span>Back</span>
          </div>
        </Button>
      )}
      <Button type='submit' isLoading={isLoading}>
        <div className='btnIconText'>
          {isLastStep ? (isUpdate ? 'Update' : 'Submit') : 'Next'}
          {!isLastStep && <RightIcon />}
        </div>
      </Button>
    </div>
  );
};

export default FormNavigation;
