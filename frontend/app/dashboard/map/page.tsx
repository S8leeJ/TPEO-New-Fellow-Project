import MapComponent from "@/components/MapComponent";
import { getApartments } from "../compare/actions";

export default async function MapPage() {
  const apartments = await getApartments();

  return (
    <div className="-m-6 h-[calc(100vh-3.5rem)] min-h-[400px]">
      <MapComponent apartments={apartments} />
    </div>
  );
}
