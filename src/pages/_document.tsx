import Document, { Html, Head, Main, NextScript } from 'next/document'
// import { useContext } from 'react'
// import { DarkModeContext } from '../hooks/DarkModeContext'

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
		// const { darkMode } = useContext(DarkModeContext);
		const darkMode = { darkModeEnabled: false };
    return (
      <Html
			className={`${darkMode.darkModeEnabled ? 'dark' : ''}`}	
			>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
