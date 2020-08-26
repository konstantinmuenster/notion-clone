import Layout from "../components/layout";

import "typeface-nunito-sans";
import "typeface-roboto";
import "../shared/global.scss";

const MyApp = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
