'use client';
import React from 'react';
import s from './Checkbox.module.css';

const Checkbox = ({ onChange, checked }) => {
  return (
    <input
      type='checkbox'
      className={s.checkboxInput}
      checked={checked}
      onChange={onChange}
    />
  );
};

export default Checkbox;
