import { useState, useEffect } from "react";
import { getBusinessUserSlots } from "../api/users";

export interface Slot {
  scheduledAt: string;
  endAt: string;
}

interface ReserveModalProps {
  businessId: string;
  onClose: () => void;
  onSelectSlot: (slot: Slot) => void;
}

export const ReserveModal = ({
  businessId,
  onClose,
  onSelectSlot,
}: ReserveModalProps) => {
  const [date, setDate] = useState("");
  // const [date, setDate] = useState(initialDate);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await getBusinessUserSlots(businessId, date);
        setSlots(res);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date, businessId]);

  return (
    <div className="p-4 w-90">
      <h2 className="text-lg font-semibold mb-2">Booking form</h2>

      <input
        type="date"
        value={date}
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      {loading && <p>Завантаження...</p>}

      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.scheduledAt}
            onClick={() => onSelectSlot(slot)}
            className="p-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            {new Date(slot.scheduledAt).toLocaleTimeString("uk-UA", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Europe/Kiev",
            })}
          </button>
        ))}
      </div>

      <button
        onClick={onClose}
        className="mt-4 w-full p-2 border text-white border-gray-300 rounded bg-gray-500 hover:bg-gray-400 cursor-pointer"
      >
        Close
      </button>
    </div>
  );
};
