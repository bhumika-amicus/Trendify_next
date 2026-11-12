export default function CartLoading() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full min-h-[60vh] animate-pulse">
      {/* Breadcrumbs skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-12 rounded bg-gray-200" />
        <span className="text-gray-300">/</span>
        <div className="h-4 w-24 rounded bg-gray-200" />
      </div>

      {/* Heading skeleton */}
      <div className="h-8 w-56 rounded bg-gray-200 mb-8 mt-2" />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cart Items List Skeleton */}
        <div className="flex-1 w-full">
          <div className="hidden md:flex bg-gray-900 py-3 px-4 mb-2 gap-4 rounded-t-md h-12" />

          <div className="flex flex-col border-t border-gray-200 md:border-t-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row items-center border-b border-gray-200 py-6 gap-4"
              >
                <div className="flex items-center flex-1 w-full gap-4">
                  <div className="h-24 w-24 shrink-0 rounded bg-gray-200" />
                  <div className="flex flex-col gap-2.5 flex-1">
                    <div className="h-5 w-3/4 rounded bg-gray-200" />
                    <div className="h-4 w-20 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="w-full md:w-32 flex justify-between md:justify-center">
                  <div className="h-5 w-16 rounded bg-gray-200" />
                </div>
                <div className="w-full md:w-32 flex justify-between md:justify-center">
                  <div className="h-8 w-24 rounded bg-gray-200" />
                </div>
                <div className="w-full md:w-32 flex justify-between md:justify-end">
                  <div className="h-5 w-20 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar Skeleton */}
        <div className="w-full lg:w-80 xl:w-96 self-start">
          <div className="border border-gray-200 bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-gray-900 py-3 px-6 h-11" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-36 rounded bg-gray-200" />
                <div className="h-4 w-12 rounded bg-gray-200" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-4 w-14 rounded bg-gray-200" />
              </div>

              <div className="border-t border-gray-200 my-6" />

              <div className="flex justify-between items-center mb-6">
                <div className="h-6 w-16 rounded bg-gray-300" />
                <div className="h-7 w-24 rounded bg-gray-300" />
              </div>

              <div className="flex flex-col gap-3">
                <div className="h-11 w-full rounded bg-gray-200" />
                <div className="h-11 w-full rounded bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

