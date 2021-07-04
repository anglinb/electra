import type { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import { DarkModeContextProvider } from '../hooks/DarkModeContext';
import 'tailwindcss/tailwind.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <DarkModeContextProvider>
        <Component {...pageProps} />
      </DarkModeContextProvider>
    </Provider>
  );
}

export default MyApp;
