import EditablePage from "../components/editablePage";

// If a user hits "/", we create a blank page and redirect to that page
// so that each user gets his/her personal space to test things

const IndexPage = ({ pid, blocks, fetchError }) => {
  return <EditablePage id={pid} fetchedBlocks={blocks} err={fetchError} />;
};

export const getServerSideProps = async (context) => {
  // res is server-side only - if we don't have it, render a blank page
  const res = context.res;
  const blocks = [{ tag: "p", html: "" }];
  if (res && blocks) {
    try {
      const response = await fetch(`${process.env.API}/pages`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blocks: blocks,
        }),
      });
      const data = await response.json();
      res.writeHead(302, { Location: `/p/${data.pageId}` });
      res.end();
    } catch (err) {
      console.log(err);
      return { props: { blocks: null, pid: null, fetchError: true } };
    }
  } else {
    return { props: { blocks: blocks, pid: null, fetchError: null } };
  }
};

export default IndexPage;
