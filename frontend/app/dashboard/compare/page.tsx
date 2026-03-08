"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  addToCompare,
  getCompareItems,
  removeFromCompare,
  type CompareItemWithDetails,
} from "./actions";
import AddApartmentsModal from "./AddApartmentsModal";
import SelectUnitsModal from "./SelectUnitsModal";

const CARD_WIDTH = "w-52"; // 208px - shared so unit cards and table columns align

const FEATURES = [
  { id: "price", label: "Price" },
  { id: "bedrooms", label: "Bedrooms" },
  { id: "bathrooms", label: "Bathrooms" },
  { id: "sq_ft", label: "Floor Area (sq ft)" },
  { id: "floor", label: "Floor" },
  { id: "windows", label: "Windows" },
  { id: "amenities", label: "Amenities" },
] as const;

function compareKey(apartmentId: string, unitId: string) {
  return `${apartmentId}:${unitId}`;
}

function formatPrice(centsOrDollars: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(centsOrDollars);
}

function getFeatureValue(
  item: CompareItemWithDetails,
  featureId: (typeof FEATURES)[number]["id"]
): string {
  switch (featureId) {
    case "price":
      return item.unit.monthly_rent != null
        ? formatPrice(item.unit.monthly_rent)
        : "—";
    case "bedrooms":
      return item.unit.bedrooms != null ? String(item.unit.bedrooms) : "—";
    case "bathrooms":
      return item.unit.bathrooms != null ? String(item.unit.bathrooms) : "—";
    case "sq_ft":
      return item.unit.sq_ft != null ? `${item.unit.sq_ft} sq ft` : "—";
    case "floor":
      return item.unit.floor != null ? String(item.unit.floor) : "—";
    case "windows":
      return item.unit.windows != null ? item.unit.windows : "—";
    case "amenities":
      return "—";
    default:
      return "—";
  }
}

export default function ComparePage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(
    FEATURES.reduce((acc, f) => ({ ...acc, [f.id]: true }), {})
  );
  const [compareItems, setCompareItems] = useState<CompareItemWithDetails[]>([]);
  const [apartmentsModalOpen, setApartmentsModalOpen] = useState(false);
  const [unitsModalOpen, setUnitsModalOpen] = useState(false);
  const [unitsModalApartments, setUnitsModalApartments] = useState<{
    ids: string[];
    names: Map<string, string>;
  }>({ ids: [], names: new Map() });
  const [loading, setLoading] = useState(true);

  const fetchCompareItems = useCallback(async () => {
    const data = await getCompareItems();
    setCompareItems(data);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCompareItems().finally(() => setLoading(false));
  }, [fetchCompareItems]);

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleFeatures = FEATURES.filter(
    (f) => activeFilters[f.id] !== false
  );
  const activeCount = Object.values(activeFilters).filter(Boolean).length;

  const handleSelectApartments = (
    apartmentIds: string[],
    apartmentNames: Map<string, string>
  ) => {
    setUnitsModalApartments({ ids: apartmentIds, names: apartmentNames });
    setUnitsModalOpen(true);
  };

  const handleAddUnit = async (apartmentId: string, unitId: string) => {
    const result = await addToCompare(apartmentId, unitId);
    if (!result.ok) throw new Error(result.error);
    await fetchCompareItems();
  };

  const handleRemoveFromCompare = async (compareItemId: string) => {
    await removeFromCompare(compareItemId);
    await fetchCompareItems();
  };

  const existingCompareKeys = new Set(
    compareItems.map((c) => compareKey(c.apartment_id, c.unit_id))
  );

  return (
    <div className="-m-6 flex min-h-[calc(100vh-3.5rem-3rem)] flex-1 flex-col bg-zinc-50 p-6">
      <AddApartmentsModal
        isOpen={apartmentsModalOpen}
        onClose={() => setApartmentsModalOpen(false)}
        existingFavoriteIds={new Set()}
        onSelectApartments={handleSelectApartments}
      />
      <SelectUnitsModal
        isOpen={unitsModalOpen}
        onClose={() => setUnitsModalOpen(false)}
        apartmentIds={unitsModalApartments.ids}
        apartmentNames={unitsModalApartments.names}
        existingCompareKeys={existingCompareKeys}
        onAddUnit={handleAddUnit}
      />

      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Compare
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Add units to compare price, layout, and features side by side.
          </p>
        </div>

        {/* Filter toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 hover:border-zinc-300"
            aria-expanded={filtersOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
            >
              <path
                fillRule="evenodd"
                d="M2.628 1.601C5.028 2.336 7.49 3.75 9.822 5.304A23.565 23.565 0 0117.998 5h.002a.75.75 0 01.75.75v.5a.75.75 0 01-.75.75h-.002a22.075 22.075 0 00-7.064 2.046 23.562 23.562 0 00-8.316 8.316 22.076 22.076 0 00-2.046 7.064.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75v-.003a23.563 23.563 0 011.6-7.428zM15 8.5a.75.75 0 01.75-.75h.5a.75.75 0 01.75.75v.5a.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75v-.5z"
                clipRule="evenodd"
              />
            </svg>
            Filters
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600">
              {activeCount}/{FEATURES.length}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-zinc-400"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Collapsible filter chips */}
      {filtersOpen && (
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Compare by
          </p>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFilter(f.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeFilters[f.id]
                    ? "bg-zinc-900 text-white hover:bg-zinc-800"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Unit cards strip */}
      <div className={`mb-2 flex gap-4 overflow-x-auto pb-1`}>
        <button
          type="button"
          onClick={() => setApartmentsModalOpen(true)}
          className={`flex h-[300px] ${CARD_WIDTH} shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 bg-white text-zinc-400 transition-colors hover:border-zinc-400 hover:bg-zinc-50`}
          aria-label="Add units to compare"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-zinc-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </span>
          <span className="text-sm font-medium">Add unit</span>
        </button>

        {loading ? (
          <div className={`flex h-[300px] ${CARD_WIDTH} shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white`}>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Loading…
            </div>
          </div>
        ) : compareItems.length === 0 ? (
          <div className={`flex h-[300px] ${CARD_WIDTH} shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white text-center`}>
            <p className="text-sm text-zinc-500">No units added yet</p>
            <p className="text-xs text-zinc-400">
              Click &quot;Add unit&quot; to get started
            </p>
          </div>
        ) : (
          compareItems.map((item) => (
            <div
              key={item.id}
              className={`relative flex h-[300px] ${CARD_WIDTH} shrink-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow`}
            >
              <button
                type="button"
                onClick={() => handleRemoveFromCompare(item.id)}
                className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 text-zinc-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-zinc-700"
                aria-label={`Remove ${item.apartment.name} from compare`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-zinc-100">
                {item.unit.image_url ? (
                  <Image
                    src={item.unit.image_url}
                    alt={item.unit.layout_name ?? item.unit.room_type ?? "Unit"}
                    fill
                    className="object-cover"
                    sizes="208px"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-zinc-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center p-4">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {item.apartment.name}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {item.unit.layout_name ?? item.unit.room_type}
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-700">
                  {item.unit.monthly_rent != null
                    ? formatPrice(item.unit.monthly_rent)
                    : "—"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Feature comparison table - aligned with unit columns, no card */}
      {compareItems.length > 0 && visibleFeatures.length > 0 && (
        <div className="min-w-0 flex-1 overflow-auto">
          <div className={`flex min-w-max gap-4`}>
            <div className={`${CARD_WIDTH} shrink-0`}>
              <div className="h-11 border-b border-zinc-200 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Apartment
                </span>
              </div>
              {visibleFeatures.map((f) => (
                <div
                  key={f.id}
                  className="flex h-11 items-center border-b border-zinc-100 py-2 text-sm font-medium text-zinc-700 last:border-b-0"
                >
                  {f.label}
                </div>
              ))}
            </div>
            {compareItems.map((item) => (
              <div key={item.id} className={`${CARD_WIDTH} shrink-0`}>
                <div className="h-11 border-b border-zinc-200 py-2.5">
                  <span className="truncate text-xs font-medium text-zinc-500">
                    {item.apartment.name}
                  </span>
                </div>
                {visibleFeatures.map((f) => (
                  <div
                    key={f.id}
                    className="flex h-11 items-center border-b border-zinc-100 py-2 text-sm text-zinc-600 last:border-b-0"
                  >
                    {getFeatureValue(item, f.id)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
