const ShimmerLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <div className="shimmer h-8 w-48 mx-auto rounded mb-6"></div>
        <div className="space-y-4">
          <div className="shimmer h-32 rounded-xl"></div>
          <div className="shimmer h-32 rounded-xl"></div>
          <div className="shimmer h-32 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerLoader;
