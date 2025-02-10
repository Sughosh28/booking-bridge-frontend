import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from './header/Header'
import Login from './components/Login'
import Registration from './components/Register'
import Home from './pages/Home'
import MyBookings from './pages/MyBookings'
import BookingHistory from './pages/BookingHistory'
import OrganizerDashboard from './organizer/OrganizerDashboard'
import ManageEvents from './organizer/ManageEvents'
import CreateEvents from './organizer/CreateEvents'
import Analytics from './organizer/Analytics'
import EditEvent from './organizer/EditEvent'

function App() {
  const { role } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />

          {role === 'ROLE_ORGANIZER' ? (
            <>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<OrganizerDashboard />} />
              <Route path="/manage-events" element={<ManageEvents />} />
              <Route path="/create-event" element={<CreateEvents />} />
              <Route path="/analytics/:eventId" element={<Analytics />} />
              <Route path="/edit-event/:id" element={<EditEvent />} />
              </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/history" element={<BookingHistory />} />
            </>
          )}

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
