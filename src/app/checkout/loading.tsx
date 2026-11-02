export default function CheckoutLoading() {
  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
        <span className="text-gray-300">/</span>
        <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
        <span className="text-gray-300">/</span>
        <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
      </div>

      {/* Page Title Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-44 rounded bg-gray-200 animate-pulse" />
        <div className="mt-2 h-4 w-72 rounded bg-gray-100 animate-pulse" />
      </div>

      {/* Stepper Wizard Bar Skeleton */}
      <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gray-200 animate-pulse" />
            <div className="hidden sm:block h-4 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Two Column Layout (Form & Summary) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Form & Address Skeleton */}
        <div className="flex-1 w-full space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="h-28 rounded-lg border border-gray-200 bg-gray-50/70 p-4 animate-pulse space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-3 w-44 rounded bg-gray-200" />
                <div className="h-3 w-28 rounded bg-gray-200" />
              </div>
              <div className="h-28 rounded-lg border border-gray-200 bg-gray-50/70 p-4 animate-pulse space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-3 w-44 rounded bg-gray-200" />
                <div className="h-3 w-28 rounded bg-gray-200" />
              </div>
            </div>

            {/* Input Placeholders */}
            <div className="space-y-4 pt-4">
              <div className="h-10 w-full rounded border border-gray-200 bg-gray-100 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-10 w-full rounded border border-gray-200 bg-gray-100 animate-pulse" />
                <div className="h-10 w-full rounded border border-gray-200 bg-gray-100 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Skeleton */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="bg-gray-900 py-3 px-6">
              <div className="h-4 w-32 rounded bg-gray-700 animate-pulse" />
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <div className="h-5 w-16 rounded bg-gray-300 animate-pulse" />
                <div className="h-6 w-24 rounded bg-gray-300 animate-pulse" />
              </div>
              <div className="h-11 w-full rounded bg-gray-200 animate-pulse pt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
