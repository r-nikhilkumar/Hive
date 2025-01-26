const UserSkeleton = () => {
  return (
    <div className="user-card skeleton">
      <div className="rounded-full w-14 h-14 bg-gray-300 animate-pulse"></div>
      <div className="flex-center flex-col gap-1 mt-2">
        <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
        <div className="w-16 h-3 bg-gray-300 animate-pulse mt-1"></div>
      </div>
      <div className="w-20 h-8 bg-gray-300 animate-pulse mt-2"></div>
    </div>
  );
};

export default UserSkeleton;
