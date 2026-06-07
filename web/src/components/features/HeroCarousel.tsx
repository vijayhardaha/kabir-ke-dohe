'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { formatDoha } from '@/lib/utils/doha';

/**
 * A carousel slide representing a single couplet with its meaning.
 *
 * @type {CarouselSlide}
 * @property {string} slug - URL slug for the couplet.
 * @property {string} text_hi - Hindi text of the couplet.
 * @property {string | null} meaning_hi - Hindi meaning.
 */
export interface CarouselSlide {
  slug: string;
  text_hi: string;
  meaning_hi: string | null;
}

/**
 * Props for the HeroCarousel component.
 *
 * @type {HeroCarouselProps}
 * @property {CarouselSlide[]} slides - Array of couplets to display.
 */
interface HeroCarouselProps {
  slides: CarouselSlide[];
}

/**
 * Hero section carousel showing couplets with their meanings.
 * Supports auto-play, mouse/touch drag, and pagination dots.
 *
 * @param {HeroCarouselProps} props - Component props.
 *
 * @returns {JSX.Element} The carousel component.
 */
export default function HeroCarousel({ slides }: HeroCarouselProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const [fadeIn, setFadeIn] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalSlides = slides.length;

  /**
   * Switch to the next slide with a fade-out / fade-in transition.
   */
  const transitionToSlide = useCallback((nextIndex: number): void => {
    currentIndexRef.current = nextIndex;

    // Fade out
    setFadeIn(false);

    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

    fadeTimeoutRef.current = setTimeout(() => {
      // Swap content
      setCurrentIndex(nextIndex);
      // Fade in on the next frame
      requestAnimationFrame(() => {
        setFadeIn(true);
      });
    }, 500);
  }, []);

  // Auto-play
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const next = (currentIndexRef.current + 1) % totalSlides;
      transitionToSlide(next);
    }, 5000);
  }, [totalSlides, transitionToSlide]);

  useEffect(() => {
    if (totalSlides <= 1) return;
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [totalSlides, startAutoPlay]);

  const goToSlide = (index: number): void => {
    transitionToSlide(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      startAutoPlay();
    }
  };

  if (totalSlides === 0) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl bg-white/10 p-6">
        <p className="text-primary-foreground/60 text-sm">No couplets available</p>
      </div>
    );
  }

  const slide = slides[currentIndex]!;

  return (
    <div className="relative w-full max-w-lg">
      {/* Carousel card */}
      <div className="select-none">
        <Link
          href={`/couplet/${slide.slug}`}
          className={`group relative block bg-black/10 p-8 no-underline backdrop-blur-sm transition-all duration-500 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Decorative quote icon — positioned at the top-right edge */}
          <svg
            className="absolute -top-6 left-8 h-10 w-10 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          {/* Hindi text */}
          <p className="mb-3 text-2xl font-bold text-white">{formatDoha(slide.text_hi)}</p>

          {/* Hindi meaning — truncated to 150 characters */}
          {slide.meaning_hi && (
            <>
              <span className="mt-3 block text-[10px] font-semibold tracking-wider text-white uppercase">Meaning</span>
              <p className="mt-1 text-sm leading-relaxed text-white/80">
                {slide.meaning_hi.length > 150 ? `${slide.meaning_hi.slice(0, 150)}...` : slide.meaning_hi}
              </p>
            </>
          )}
        </Link>
      </div>

      {/* Pagination dots */}
      {totalSlides > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="cursor-pointer rounded-full transition-all duration-300 focus:outline-none"
              style={{
                width: index === currentIndex ? '12px' : '8px',
                height: index === currentIndex ? '12px' : '8px',
                opacity: index === currentIndex ? 1 : 0.4,
                backgroundColor: 'white',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
