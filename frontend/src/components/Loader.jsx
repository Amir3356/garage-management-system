const Loader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
      <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="shimmer h-4 w-1/3 rounded mb-4"></div>
    <div className="shimmer h-3 w-2/3 rounded mb-2"></div>
    <div className="shimmer h-3 w-1/2 rounded"></div>
  </div>
);

export const SkeletonRow = () => (
  <tr className="border-b border-gray-100">
    <td className="p-4"><div className="shimmer h-4 w-full rounded"></div></td>
    <td className="p-4"><div className="shimmer h-4 w-full rounded"></div></td>
    <td className="p-4"><div className="shimmer h-4 w-full rounded"></div></td>
    <td className="p-4"><div className="shimmer h-4 w-20 rounded"></div></td>
  </tr>
);

export default Loader;
