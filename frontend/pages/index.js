import EditablePage from "../components/editablePage";

// If a user hits "/", we create a blank page and redirect to that page
// so that each user gets his/her personal space to test things

const IndexPage = ({ pid, blocks, err }) => {
  return <EditablePage id={pid} fetchedBlocks={blocks} err={err} />;
};

export const getServerSideProps = async (context) => {
  const blocks = [{ tag: "p", html: "", imageUrl: "" }];
  const res = context.res;
  const req = context.req;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pages`, {
      method: "POST",
      credentials: "include",
      // Forward the authentication cookie to the backend
      headers: {
        "Content-Type": "application/json",
        Cookie: req ? req.headers.cookie : undefined,
      },
      body: JSON.stringify({
        blocks: blocks,
      }),
    });
    const data = await response.json();
    const pageId = data.pageId;
    const creator = data.creator;
    const query = !creator ? "?public=true" : ""; // needed to show notice
    res.writeHead(302, { Location: `/p/${pageId}${query}` });
    res.end();
    return { props: {} };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, pid: null, err: true } };
  }
};

export default IndexPage;
