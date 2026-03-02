export const LoadingError = ({
  loading,
  error,
}: {
  loading: boolean;
  error: string | null;
}) => {
  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-center py-4 text-red-500">{error}</p>;
  return null;
};
