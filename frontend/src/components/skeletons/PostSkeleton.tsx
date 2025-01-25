import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PostSkeleton = () => {
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Skeleton circle={true} height={48} width={48} />
          <div className="flex flex-col">
            <Skeleton width={100} height={20} />
            <div className="flex-center gap-2">
              <Skeleton width={60} height={15} />
              •
              <Skeleton width={60} height={15} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 items-center">
          <Skeleton width={20} height={20} />
          <Skeleton width={20} height={20} />
        </div>
      </div>
      <div className="small-medium lg:base-medium py-5">
        <Skeleton count={3} />
        <div className="flex gap-1 mt-2">
          <Skeleton width={50} height={20} />
          <Skeleton width={50} height={20} />
          <Skeleton width={50} height={20} />
        </div>
      </div>
      <div className="post-card_media-container">
        <Skeleton height={200} />
      </div>
      <div className="post-out-comment">
        <Skeleton circle={true} height={48} width={48} />
        <Skeleton width="100%" height={40} />
      </div>
    </div>
  );
};

export default PostSkeleton;
