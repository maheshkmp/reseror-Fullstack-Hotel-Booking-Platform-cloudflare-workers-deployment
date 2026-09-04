"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * ResultScroller - Ensures the scroll position returns to the results top
 * when filter params change.
 */
export function ResultScroller() {
  const searchParams = useSearchParams();
  const firstRender = useRef(true);

  useEffect(() => {
    // Skip the very first render to avoid scrolling on initial page load
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Scroll to the results area top
    // We target the main layout container if it's below the sticky header
    const resultsContainer = document.getElementById("search-results-container");
    if (resultsContainer) {
      const headerOffset = 150; // Offset for sticky search bar
      const elementPosition = resultsContainer.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [searchParams]);

  return null;
}
