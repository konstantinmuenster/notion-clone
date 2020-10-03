import { resetServerContext } from "react-beautiful-dnd";

import EditablePage from "../../components/editablePage/index";

const Page = ({ pid, blocks, err }) => {
  return <EditablePage id={pid} fetchedBlocks={blocks} err={err} />;
};

export const getServerSideProps = async (context) => {
  resetServerContext(); // needed for drag and drop functionality
  const pageId = context.query.pid;
  const req = context.req;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/pages/${pageId}`,
      {
        method: "GET",
        credentials: "include",
        // Forward the authentication cookie to the backend
        headers: {
          "Content-Type": "application/json",
          Cookie: req ? req.headers.cookie : undefined,
        },
      }
    );
    const data = await response.json();
    return {
      props: { blocks: data.page.blocks, pid: pageId, err: false },
    };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, pid: null, err: true } };
  }
};

export default Page;
