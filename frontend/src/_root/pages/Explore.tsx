import { useEffect, useState } from "react";
// import { useInView } from "react-intersection-observer";

import { Input } from "@/components/ui";
import { GridPostList, Loader } from "@/components/shared";
import { useGetPostsQuery } from "@/redux/api/postApi";
import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "@/redux/api/userApi";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

// const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
//   if (isSearchFetching) {
//     return <Loader />;
//   } else if (searchedPosts && searchedPosts.documents.length > 0) {
//     return <GridPostList posts={searchedPosts.documents} />;
//   } else {
//     return (
//       <p className="text-light-4 mt-10 text-center w-full">No results found</p>
//     );
//   }
// };

const Explore = () => {
  // const { ref, inView } = useInView();
  // const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState("");
  const {
    data: postsDetails,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery();
  const userId = useSelector((state) => state.auth.userId);
  const { data: userDetails, isSuccess:isUserDetailsSuccess, isLoading: isUserDetailsLoading} = useGetUserByIdQuery(userId, {skip: !userId});

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-full bg-dark-3">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">       
        {isSuccess && isUserDetailsSuccess && <GridPostList posts={postsDetails?.data}  user={userDetails?.data}/>}
      </div>
    </div>
  );
};

export default Explore;
