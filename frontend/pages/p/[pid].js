import EditablePage from "../../components/editablePage/index";

const Page = ({ pid, blocks, fetchError }) => {
  return <EditablePage id={pid} fetchedBlocks={blocks} err={fetchError} />;
};

export const getServerSideProps = async (context) => {
  const pageId = context.query.pid;
  try {
    const response = await fetch(`${process.env.API}/pages/${pageId}`);
    const data = await response.json();
    return {
      props: { blocks: data.page.blocks, pid: pageId, fetchError: false },
    };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, pid: null, fetchError: true } };
  }
};

export default Page;
