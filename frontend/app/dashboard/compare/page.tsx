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

const ACTIVE_FEATURES = ["Price", "Bedrooms", "Bathrooms", "Floor Area (sqft)", "Floor", "Windows", "Amenities"];

const FILTER_TAGS = [
  { id: "price", label: "Price", active: true },
  { id: "bedrooms", label: "Bedrooms", active: true },
  { id: "bathrooms", label: "Bathrooms", active: true },
  { id: "floor-area-sqft", label: "Floor Area", active: true },
  { id: "amenities", label: "Amenities", active: true },
  { id: "location", label: "Location", active: false },
  { id: "num-people", label: "Number of People", active: false },
  { id: "floor", label: "Floor", active: true },
  { id: "windows", label: "Windows", active: true },
  { id: "dining", label: "Dining", active: false },
  { id: "popular", label: "Popular reviews", active: false },
  { id: "controversial", label: "Controversial reviews", active: false },
];

const FEATURE_TO_TAG_ID: Record<string, string> = {
  "Price": "price",
  "Bedrooms": "bedrooms",
  "Bathrooms": "bathrooms",
  "Floor Area (sqft)": "floor-area-sqft",
  "Floor": "floor",
  "Windows": "windows",
  "Amenities": "amenities",
};

function compareKey(apartmentId: string, unitId: string) {
  return `${apartmentId}:${unitId}`;
}

function formatPrice(centsOrDollars: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(centsOrDollars);
}

function getFeatureValue(item: CompareItemWithDetails, feature: string): string {
  switch (feature) {
    case "Price":
      return item.unit.monthly_rent != null ? formatPrice(item.unit.monthly_rent) : "—";
    case "Bedrooms":
      return item.unit.bedrooms != null ? String(item.unit.bedrooms) : "—";
    case "Bathrooms":
      return item.unit.bathrooms != null ? String(item.unit.bathrooms) : "—";
    case "Floor Area (sqft)":
      return item.unit.sq_ft != null ? `${item.unit.sq_ft} sq ft` : "—";
    case "Floor":
      return item.unit.floor != null ? String(item.unit.floor) : "—";
    case "Windows":
      return item.unit.windows != null ? item.unit.windows : "—";
    case "Amenities":
      return "—";
    default:
      return "—";
  }
}

export default function ComparePage() {
  const [activeTags, setActiveTags] = useState(
    FILTER_TAGS.reduce(
      (acc, t) => ({ ...acc, [t.id]: t.active }),
      {} as Record<string, boolean>
    )
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
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch requires loading state */
    setLoading(true);
    fetchCompareItems().finally(() => setLoading(false));
  }, [fetchCompareItems]);

  const toggleTag = (id: string) => {
    setActiveTags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectApartments = (
    apartmentIds: string[],
    apartmentNames: Map<string, string>
  ) => {
    setUnitsModalApartments({ ids: apartmentIds, names: apartmentNames });
    setUnitsModalOpen(true);
  };

  const handleAddUnit = async (apartmentId: string, unitId: string) => {
    const result = await addToCompare(apartmentId, unitId);
    if (!result.ok) {
      throw new Error(result.error);
    }
    await fetchCompareItems();
  };

  const handleRemoveFromCompare = async (compareItemId: string) => {
    await removeFromCompare(compareItemId);
    await fetchCompareItems();
  };

  const existingCompareKeys = new Set(
    compareItems.map((c) => compareKey(c.apartment_id, c.unit_id))
  );

  const visibleFeatures = ACTIVE_FEATURES.filter(
    (feature) => activeTags[FEATURE_TO_TAG_ID[feature]] !== false
  );

  return (
    <div className="-m-6 flex min-h-[calc(100vh-3.5rem-3rem)] flex-1 flex-col bg-white p-6">
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

      <h1 className="mb-4 text-2xl font-bold text-zinc-900">Compare</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_TAGS.map((tag) => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`rounded-lg border px-4 py-1 text-sm font-medium transition-colors ${
              activeTags[tag.id]
                ? "border-zinc-800 bg-zinc-800 text-white hover:bg-zinc-700"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      <div className="mb-0 flex gap-4 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setApartmentsModalOpen(true)}
          className="flex h-[280px] w-48 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 text-4xl text-zinc-400 transition-colors hover:border-zinc-400 hover:bg-zinc-100"
          aria-label="Add apartments to compare"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-zinc-400">
            +
          </span>
        </button>

        {loading ? (
          <div className="flex h-[280px] w-48 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm text-zinc-500">
            Loading…
          </div>
        ) : compareItems.length === 0 ? (
          <div className="flex h-[280px] w-48 shrink-0 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
            Click + to add units
          </div>
        ) : (
          compareItems.map((item) => (
            <div
              key={item.id}
              className="relative flex h-[280px] w-48 shrink-0 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <button
                type="button"
                onClick={() => handleRemoveFromCompare(item.id)}
                className="absolute right-2 top-2 rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                aria-label={`Remove ${item.apartment.name} ${item.unit.layout_name ?? item.unit.room_type} from compare`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
              <p className="mb-1 text-sm font-bold text-zinc-900">{item.apartment.name}</p>
              <p className="mb-2 text-sm text-zinc-600">{item.unit.layout_name ?? item.unit.room_type}</p>
              <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-lg bg-zinc-200">
                {item.unit.image_url ? (
                  <Image
                    src={item.unit.image_url}
                    alt={item.unit.layout_name ?? item.unit.room_type ?? "Unit"}
                    fill
                    className="object-cover"
                    sizes="192px"
                    unoptimized
                  />
                ) : null}
              </div>
              <p className="text-center text-sm font-medium text-zinc-600">
                {item.unit.monthly_rent != null ? formatPrice(item.unit.monthly_rent) : "—"}
              </p>
            </div>
          ))
        )}
      </div>

      {compareItems.length > 0 && visibleFeatures.length > 0 && (
        <div className="min-w-0 flex-1 overflow-auto bg-white px-4 pb-4 pt-0">
          <div className="flex gap-4">
            <div className="flex w-48 shrink-0 flex-col border-r border-zinc-200 pr-4">
              {visibleFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex h-10 shrink-0 items-center justify-center border-b border-zinc-200 py-3 last:border-b-0 text-sm font-bold text-zinc-700"
                >
                  {feature}
                </div>
              ))}
            </div>
            {compareItems.map((item) => (
              <div
                key={item.id}
                className="flex w-48 shrink-0 flex-col border-r border-zinc-200 pr-4 last:border-r-0"
              >
                {visibleFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex h-10 shrink-0 items-center justify-center border-b border-zinc-200 py-3 last:border-b-0 text-sm text-zinc-600"
                  >
                    {getFeatureValue(item, feature)}
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
