import { useEffect, useState } from "react";
import api from "../api";
import { MapPin } from "lucide-react";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/schools");
      setSchools(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return <p className="text-center text-gray-600">Loading schools...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Available Schools
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {schools.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
          >
            <img
              src={s.imageUrl}
              alt={s.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-semibold text-lg">{s.name}</h3>
              <p className="text-gray-600">{s.address}</p>
              <p className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" /> {s.city}
              </p>
            </div>
          </div>
        ))}
        {schools.length === 0 && (
          <p className="text-gray-500">No schools added yet.</p>
        )}
      </div>
    </div>
  );
}
