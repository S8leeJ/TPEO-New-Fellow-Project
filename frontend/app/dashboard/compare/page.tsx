"use client";

import { useState } from "react";

const FILTER_TAGS = [
  { id: "location", label: "Location", active: false },
  { id: "floor-area", label: "Floor Area", active: true },
  { id: "bathrooms", label: "Bathrooms", active: true },
  { id: "amenities", label: "Amenities", active: true },
  { id: "num-people", label: "Number of People", active: false },
  { id: "bedrooms", label: "Bedrooms", active: true },
  { id: "dining", label: "Dining", active: true },
  { id: "popular", label: "Popular reviews", active: false },
  { id: "controversial", label: "Controversial reviews", active: false },
];

const ACTIVE_FEATURES = ["Bedrooms", "Bathrooms", "Floor Area", "Amenities"];

const PLACEHOLDER_ITEMS = [1, 2, 3, 4]; // 4 comparison columns

export default function ComparePage() {
  const [activeTags, setActiveTags] = useState(
    FILTER_TAGS.reduce(
      (acc, t) => ({ ...acc, [t.id]: t.active }),
      {} as Record<string, boolean>
    )
  );

  const toggleTag = (id: string) => {
    setActiveTags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem-3rem)] flex-1 flex-col">
      
      <div className="shrink-0 space-y-4 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Compare</h1>

        {/* Filter Tags - centered */}
        <div className="flex flex-wrap justify-center gap-2">
          
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTags[tag.id]
                  ? "bg-zinc-800 text-white hover:bg-zinc-700"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid - fills remaining space, scrollable */}
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex justify-center py-4">
        <div className="inline-flex min-w-max gap-6">
          {/* Left Column - Add Button + Feature Labels */}
          <div className="flex w-32 shrink-0 flex-col">
            <div className="mb-4 flex h-[180px] items-start">
              <button
                type="button"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 text-2xl text-zinc-400 transition-colors hover:border-zinc-400 hover:bg-zinc-100"
                aria-label="Add item"
              >
                +
              </button>
            </div>
            {ACTIVE_FEATURES.map((feature) => (
              <div
                key={feature}
                className="flex h-14 items-center border-b border-zinc-200 text-sm font-medium text-zinc-700"
              >
                {feature}
              </div>
            ))}
          </div>

          {/* Comparison Item Columns */}
          {PLACEHOLDER_ITEMS.map((item) => (
            <div key={item} className="w-52 shrink-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              {/* Name & Style */}
              <div className="mb-2 h-8">
                <p className="text-sm text-zinc-500">Name</p>
                <p className="text-sm text-zinc-500">Style</p>
              </div>
              {/* Image placeholder */}
              <div className="mb-2 aspect-[4/3] w-full rounded-lg bg-zinc-200" />
              {/* Price */}
              <div className="mb-2 h-6 text-sm text-zinc-600">$$$</div>
              {/* Data rows aligned with feature labels */}
              {ACTIVE_FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="flex h-14 items-center border-b border-zinc-100 text-sm text-zinc-500"
                >
                  —
                </div>
              ))}
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
