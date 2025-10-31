import React, { useEffect, useRef, useState } from 'react';
import s from './CodeInput.module.css';

const CodeInput = ({
  length,
  onComplete = null,
  onChange = null,
  onSubmit,
}) => {
  const [code, setCode] = useState(new Array(length).fill(''));
  const inputsRef = useRef([]);

  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      onComplete?.(code.join(''));
    }
    onChange?.(code);
  }, [code, onComplete, onChange]);

  const handleChange = (element, index) => {
    const value = element.target.value;
    if (/^\d*$/.test(value)) {
      if (value.length === 1) {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (element.target.nextSibling) {
          element.target.nextSibling.focus();
        }
      } else if (value.length === 6) {
        setCode([...value]);
        inputsRef.current.forEach((input, idx) => {
          input.value = value[idx] || '';
        });
      }
    }
  };

  const handlePaste = e => {
    const pasteData = e.clipboardData
      .getData('text')
      .slice(0, 6)
      .replace(/\D/g, '')
      .split('');
    setCode([...pasteData, ...new Array(6 - pasteData.length).fill('')]);
    inputsRef.current.forEach((input, idx) => {
      input.value = pasteData[idx] || '';
    });
    inputsRef.current[inputsRef.current?.length - 1].focus();
    e.preventDefault();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    } else if (e?.key === 'Enter' && index === 5 && code.length === 6) {
      onSubmit && onSubmit();
    }
  };

  return (
    <div className={s.codeInputs}>
      {code.map((data, index) => {
        return (
          <input
            ref={el => (inputsRef.current[index] = el)}
            autoFocus={index === 0}
            inputmode='numeric'
            name='code'
            maxLength='1'
            key={index}
            value={data}
            onChange={e => handleChange(e, index)}
            onPaste={handlePaste}
            onKeyDown={e => handleKeyDown(e, index)}
            onFocus={e => e.target.select()}
          />
        );
      })}
    </div>
  );
};

export default CodeInput;
