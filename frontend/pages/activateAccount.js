import Notice from "../components/notice";

const ActivateAccountPage = ({ activated, message }) => {
  const noticeType = activated ? "SUCCESS" : "ERROR";

  return (
    <>
      <h1 className="pageHeading">Activate Account</h1>
      <Notice status={noticeType}>{message}</Notice>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const req = context.req;

  try {
    const activationToken = context.query.token;
    if (!activationToken) {
      throw new Error("Missing activation code.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/users/activate`,
      {
        method: "POST",
        credentials: "include",
        // Forward the authentication cookie to the backend
        headers: {
          "Content-Type": "application/json",
          Cookie: req ? req.headers.cookie : undefined,
        },
        body: JSON.stringify({
          activationToken: activationToken,
        }),
      }
    );
    const data = await response.json();

    if (data.errCode) {
      throw new Error(data.message);
    } else {
      return { props: { activated: true, message: data.message } };
    }
  } catch (err) {
    console.log(err);
    return {
      props: {
        activated: false,
        message: err.message || "The activation process failed.",
      },
    };
  }
};

export default ActivateAccountPage;
