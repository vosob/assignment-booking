import { Layout } from "./page/Layout";
import { Route, Routes } from "react-router-dom";
import { AuthPage } from "./page/AuthPage";
import { HomePage } from "./page/HomePage";
import { PublicRoute } from "./page/PublicRoute";
import { AdminRoute } from "./page/AdminRoute";
import { AdminPage } from "./page/AdminPage";
import { PrivateRoute } from "./page/PrivateRoute";
import { BookingsPage } from "./page/BookingsPage";

export const App = () => {
  return (
    <>
      <Layout>
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <BookingsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </>
  );
};
