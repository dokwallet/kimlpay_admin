import s from './navigationHeader.module.css';
import { KeyboardBackspace } from '@mui/icons-material';

const NavigationHeader = ({ backText = '', onPressBack }) => {
  return (
    <div className={s.navigationHeader} onClick={onPressBack}>
      <KeyboardBackspace />
      {!!backText && <div>{backText}</div>}
    </div>
  );
};

export default NavigationHeader;
