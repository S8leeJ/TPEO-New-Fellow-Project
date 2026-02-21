'use client'

import { useState } from 'react'

export default function AddUnitPage() {
  const [apartmentName, setApartmentName] = useState('')
  const [roomType, setRoomType] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [sqFt, setSqFt] = useState('')
  const [floor, setFloor] = useState('')
  const [windows, setWindows] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // No backend connection yet - form does nothing on submit
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Add unit</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="apartmentName"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Apartment name
          </label>
          <input
            id="apartmentName"
            type="text"
            value={apartmentName}
            onChange={(e) => setApartmentName(e.target.value)}
            placeholder="e.g. 26 West"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>

        <div className="border-t border-zinc-200 pt-4">
          <h2 className="mb-3 text-sm font-medium text-zinc-700">Unit specs</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="roomType"
                className="mb-1 block text-sm text-zinc-600"
              >
                Room type
              </label>
              <input
                id="roomType"
                type="text"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                placeholder="e.g. 2B/2B A"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="bedrooms"
                  className="mb-1 block text-sm text-zinc-600"
                >
                  Bedrooms
                </label>
                <input
                  id="bedrooms"
                  type="number"
                  min={0}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>
              <div>
                <label
                  htmlFor="bathrooms"
                  className="mb-1 block text-sm text-zinc-600"
                >
                  Bathrooms
                </label>
                <input
                  id="bathrooms"
                  type="number"
                  min={0}
                  step={0.5}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="sqFt"
                  className="mb-1 block text-sm text-zinc-600"
                >
                  Sq ft
                </label>
                <input
                  id="sqFt"
                  type="number"
                  min={0}
                  value={sqFt}
                  onChange={(e) => setSqFt(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>
              <div>
                <label
                  htmlFor="floor"
                  className="mb-1 block text-sm text-zinc-600"
                >
                  Floor
                </label>
                <input
                  id="floor"
                  type="number"
                  min={0}
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="windows"
                className="mb-1 block text-sm text-zinc-600"
              >
                Windows
              </label>
              <input
                id="windows"
                type="text"
                value={windows}
                onChange={(e) => setWindows(e.target.value)}
                placeholder="e.g. East, South"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
