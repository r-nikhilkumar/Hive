import { useParams } from "react-router-dom";

import { Loader } from "@/components/shared";
import PostForm from "@/components/forms/PostForm";
import { useGetPostByIdQuery } from "@/redux/api/postApi";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostByIdQuery(id);

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    // <div className='w-full'>

    <div className="flex flex-1 w-full">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {isLoading ? <Loader /> : <PostForm action="Update" post={post.data} />}
      </div>
      </div>
    // </div>
  );
};

export default EditPost;
