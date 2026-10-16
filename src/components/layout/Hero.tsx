import ProductSearch from '@/components/product/ProductSearch';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden aspect-auto min-h-100 md:aspect-15/4 md:min-h-0">
      <img
        src="/hero.png"
        alt="Discover top products"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-12.5 text-center text-white sm:px-16 sm:py-0">
        <h1 className="m-0 max-w-175 text-4xl font-bold uppercase leading-[1.1] md:text-5xl">
          Discover Top Products
        </h1>

        <ProductSearch
          variant="hero"
          placeholder="Search"
        />
      </div>
    </section>
  );
}
