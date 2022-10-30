import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import store from "../redux/store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Provider store={store}>
        <Component {...pageProps} />
        <ToastContainer
          autoClose={5000}
          position="top-center"
          hideProgressBar={true}
          closeOnClick={true}
          transition={Slide}
        />
      </Provider>
    </UserProvider>
  );
}

export default MyApp;
