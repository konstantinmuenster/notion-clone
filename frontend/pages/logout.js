import { useEffect } from "react";
import useRouter from "next/router";

import cookies from "next-cookies";

const LogoutPage = () => {
  useEffect(() => {
    const router = useRouter;
    const logoutOnServer = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API}/users/logout`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.log(err);
      }
    };
    logoutOnServer();
    router.push("/login");
  }, []);
  return null;
};

export const getServerSideProps = async (context) => {
  const { token } = cookies(context);
  const res = context.res;

  if (!token) {
    res.writeHead(302, { Location: `/login` });
    res.end();
  }

  return { props: {} };
};

export default LogoutPage;
