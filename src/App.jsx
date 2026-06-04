import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddTruck from './pages/AddTruck';
import ProtectedRoute from './components/ProtectedRoute';
import TruckDetails from './pages/TruckDetails';
import AddTrip from './pages/AddTrip';
import TripDetails from './pages/TripDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Fakt login kelelech loka yevu shaktat) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-truck"
          element={
            <ProtectedRoute>
              <AddTruck />
            </ProtectedRoute>
          }
        />

        <Route
          path="/truck/:id"
          element={
            <ProtectedRoute>
              <TruckDetails />
            </ProtectedRoute>
          }
        />

        {/* 👇👇👇 EXACT CHANGE ITHE KELA AHE (Navin Add Trip Route) 👇👇👇 */}
        <Route
          path="/truck/:id/add-trip"
          element={
            <ProtectedRoute>
              <AddTrip />
            </ProtectedRoute>
          }
        />
        {/* Navin Trip Details Route */}
        <Route
          path="/trip/:tripId"
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;