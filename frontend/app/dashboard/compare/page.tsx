"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addToCompare,
  getCompareItems,
  removeFromCompare,
  type CompareItemWithDetails,
} from "./actions";
import AddApartmentsModal from "./AddApartmentsModal";
import SelectUnitsModal from "./SelectUnitsModal";

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

const ACTIVE_FEATURES = ["Bedrooms", "Bathrooms", "Floor Area (sqft)", "Floor", "Windows"];

function compareKey(apartmentId: string, unitId: string) {
  return `${apartmentId}:${unitId}`;
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
    await addToCompare(apartmentId, unitId);
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
    <div className="flex min-h-[calc(100vh-3.5rem-3rem)] flex-1 flex-col">
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

      <div className="shrink-0 space-y-4 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Compare</h1>

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

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex justify-start py-4">
          <div className="inline-flex min-w-max gap-6">
            <div className="flex w-32 shrink-0 flex-col">
              <div className="mb-4 flex h-[180px] items-start">
                <button
                  type="button"
                  onClick={() => setApartmentsModalOpen(true)}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 text-2xl text-zinc-400 transition-colors hover:border-zinc-400 hover:bg-zinc-100"
                  aria-label="Add apartments to compare"
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

            {loading ? (
              <div className="flex w-52 items-center justify-center text-sm text-zinc-500">
                Loading…
              </div>
            ) : compareItems.length === 0 ? (
              <div className="flex w-52 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 py-12 text-sm text-zinc-500">
                Click + to add units to compare
              </div>
            ) : (
              compareItems.map((item) => (
                <div
                  key={item.id}
                  className="relative w-52 shrink-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveFromCompare(item.id)}
                    className="absolute right-2 top-2 rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                    aria-label={`Remove ${item.apartment.name} ${item.unit.room_type} from compare`}
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
                  <div className="mb-2 pr-6">
                    <p className="text-sm font-medium text-zinc-900">
                      {item.apartment.name}
                    </p>
                    <p className="text-sm text-zinc-600">{item.unit.room_type}</p>
                    {(item.unit.bedrooms != null || item.unit.bathrooms != null) && (
                      <p className="text-xs text-zinc-500">
                        {[item.unit.bedrooms != null && `${item.unit.bedrooms} bed`, item.unit.bathrooms != null && `${item.unit.bathrooms} bath`]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="mb-2 aspect-[4/3] w-full rounded-lg bg-zinc-200" />
                  {ACTIVE_FEATURES.map((feature) => (
                    <div
                      key={feature}
                      className="flex h-14 items-center border-b border-zinc-100 text-sm text-zinc-500"
                    >
                      {feature === "Bedrooms" && item.unit.bedrooms != null
                        ? item.unit.bedrooms
                        : feature === "Bathrooms" && item.unit.bathrooms != null
                          ? item.unit.bathrooms
                          : feature === "Floor Area (sqft)" && item.unit.sq_ft != null
                            ? `${item.unit.sq_ft} sqft`
                            : feature === "Floor" && item.unit.floor != null
                              ? item.unit.floor
                              : feature === "Windows" && item.unit.windows != null
                                ? item.unit.windows
                                : "—"}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
