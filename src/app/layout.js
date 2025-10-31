import { Inter } from 'next/font/google';
import ThemeProvider from '@/theme/ThemeContext';
import './app.css';

import AppRouting from '@/components/appRouting';
import StateProvider from '@/components/StateProvider/StateProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'KimlPay',
  description: 'Cards for future',
};

export default async function RootLayout({ children }) {
  return (
    <html lang='en'>
      <StyledEngineProvider injectFirst={true}>
        <ThemeProvider>
          <body className={inter.className}>
            <StateProvider>
              <AppRouting>{children}</AppRouting>
            </StateProvider>
          </body>
        </ThemeProvider>
      </StyledEngineProvider>
    </html>
  );
}
