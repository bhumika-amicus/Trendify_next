'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { Product } from '@/types';
import ProductCard from './ProductCard';
import StateMessage from '../common/StateMessage';

interface FeaturedProductCarouselProps {
  products: Product[];
}

export default function FeaturedProductCarousel({
  products,
}: FeaturedProductCarouselProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);

  if (products.length === 0) {
    return (
      <section
        id="products"
        className="w-full max-w-full overflow-hidden px-11 py-16 max-[650px]:px-4.5"
      >
        <div className="section-heading mb-6!">
          <h2>Featured Products</h2>
        </div>
        <StateMessage
          title="No products available."
          message="The store is currently empty. Please check back later!"
          buttonText="Browse Catalog"
          actionHref="/products"
          variant="empty"
          compact
        />
      </section>
    );
  }

  return (
    <section
      id="products"
      className="w-full max-w-full overflow-hidden px-11 py-16 max-[650px]:px-4.5 [&_.swiper-pagination-bullet-active]:bg-text-muted!"
    >
      <div className="section-heading">
        <h2>Featured Products</h2>
      </div>

      <div className="relative">
        <button
          type="button"
          className="absolute top-1/2 -left-9 z-2 grid h-8 w-8 -translate-y-1/2 place-items-center border-0 bg-transparent p-0 text-brand-orange transition-colors hover:text-brand-orange-hover max-[650px]:-left-1 cursor-pointer"
          aria-label="Previous featured product"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft aria-hidden="true" className="h-7.5 w-7.5" />
        </button>

        <Swiper
          className="overflow-hidden! pb-10!"
          modules={[Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          pagination={{ clickable: true }}
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className="absolute top-1/2 -right-9 z-2 grid h-8 w-8 -translate-y-1/2 place-items-center border-0 bg-transparent p-0 text-brand-orange transition-colors hover:text-brand-orange-hover max-[650px]:-right-1 cursor-pointer"
          aria-label="Next featured product"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight aria-hidden="true" className="h-7.5 w-7.5" />
        </button>
      </div>
    </section>
  );
}
