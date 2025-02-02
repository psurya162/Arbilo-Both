import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // User authentication context
import { AdminAuthProvider } from './context/AdminAuthContext'; // Admin authentication context
import router from './routes/Route'; // Your router configuration

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <RouterProvider router={router} />
      </AdminAuthProvider>
    </AuthProvider>
  );
}
