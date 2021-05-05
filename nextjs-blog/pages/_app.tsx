import { useEffect } from "react"
import 'tailwindcss/tailwind.css'
import "./global.css"
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs"

function MyApp({ Component, pageProps }: any) {
  useEffect(() => {
      if (typeof window !== 'undefined') {
          console.log('call')
          Prism.highlightAll();
      }
  }, []);
    return <Component {...pageProps} />
  }

  export default MyApp