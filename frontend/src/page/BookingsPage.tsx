import { useEffect, useState } from "react";
import type { User } from "../types/user";
import { getBusinessUser } from "../api/users";
import type { Booking } from "../types/business";

import { BusinessListTable } from "../components/BusinessListTable";
import { MyBookingListTable } from "../components/MyBookingListTable";
import { LoadingError } from "../components/LoadingError";

export const BookingsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [listMyBookings, setListMyBookings] = useState<Booking[]>([]);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBusinessUser();
        setUsers(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading || error) return <LoadingError loading={loading} error={error} />;

  return (
    <div className="container mx-auto py-4">
      <BusinessListTable setListMyBookings={setListMyBookings} users={users} />
      <MyBookingListTable
        setListMyBookings={setListMyBookings}
        listMyBookings={listMyBookings}
        setEditBooking={setEditBooking}
        editBooking={editBooking}
      />
    </div>
  );
};
