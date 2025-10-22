import { useState, useEffect } from 'react';
import { bookingsAPI, roomsAPI, guestsAPI } from '../services/api';
import { Plus, Edit, Trash2, X, LogOut } from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    guest_id: '',
    room_id: '',
    check_in_date: '',
    check_out_date: '',
    total_amount: '',
    status: 'confirmed',
    special_requests: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, roomsRes, guestsRes] = await Promise.all([
        bookingsAPI.getAll(),
        roomsAPI.getAll(),
        guestsAPI.getAll(),
      ]);
      setBookings(bookingsRes.data);
      setRooms(roomsRes.data);
      setGuests(guestsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (formData.room_id && formData.check_in_date && formData.check_out_date) {
      const room = rooms.find(r => r.id === parseInt(formData.room_id));
      if (room) {
        const checkIn = new Date(formData.check_in_date);
        const checkOut = new Date(formData.check_out_date);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        if (nights > 0) {
          const total = nights * room.price_per_night;
          setFormData(prev => ({ ...prev, total_amount: total.toFixed(2) }));
        }
      }
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [formData.room_id, formData.check_in_date, formData.check_out_date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBooking) {
        await bookingsAPI.update(editingBooking.id, formData);
      } else {
        await bookingsAPI.create(formData);
      }
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving booking:', error);
      alert(error.response?.data?.error || 'Error saving booking. Please try again.');
    }
  };

  const handleCheckout = async (id) => {
    if (window.confirm('Are you sure you want to check out this booking?')) {
      try {
        await bookingsAPI.checkout(id);
        fetchData();
      } catch (error) {
        console.error('Error checking out:', error);
        alert('Error processing checkout. Please try again.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingsAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Error deleting booking. Please try again.');
      }
    }
  };

  const openModal = (booking = null) => {
    if (booking) {
      setEditingBooking(booking);
      setFormData({
        guest_id: booking.guest_id,
        room_id: booking.room_id,
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        total_amount: booking.total_amount,
        status: booking.status,
        special_requests: booking.special_requests || '',
      });
    } else {
      setEditingBooking(null);
      setFormData({
        guest_id: '',
        room_id: '',
        check_in_date: '',
        check_out_date: '',
        total_amount: '',
        status: 'confirmed',
        special_requests: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <button onClick={() => openModal()} className="btn btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          New Booking
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.guest_name}</div>
                      <div className="text-xs text-gray-500">{booking.guest_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.room_number}</div>
                      <div className="text-xs text-gray-500">{booking.room_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.check_in_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.total_amount.toLocaleString()} MMK
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCheckout(booking.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Check out"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openModal(booking)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBooking ? 'Edit Booking' : 'New Booking'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Guest</label>
                <select
                  className="input"
                  value={formData.guest_id}
                  onChange={(e) => setFormData({ ...formData, guest_id: e.target.value })}
                  required
                >
                  <option value="">Select a guest</option>
                  {guests.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.first_name} {guest.last_name} - {guest.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Room</label>
                <select
                  className="input"
                  value={formData.room_id}
                  onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                  required
                >
                  <option value="">Select a room</option>
                  {rooms.filter(r => r.status === 'available' || (editingBooking && r.id === editingBooking.room_id)).map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.room_number} - {room.room_type} ({room.price_per_night.toLocaleString()} MMK/night)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Check-in Date</label>
                <input
                  type="date"
                  className="input"
                  value={formData.check_in_date}
                  onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Check-out Date</label>
                <input
                  type="date"
                  className="input"
                  value={formData.check_out_date}
                  onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Total Amount (MMK)</label>
                <input
                  type="number"
                  className="input"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                  required
                  min="0"
                  step="100"
                  readOnly
                />
              </div>

              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="label">Special Requests</label>
                <textarea
                  className="input"
                  value={formData.special_requests}
                  onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                  rows="3"
                  placeholder="Any special requests..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingBooking ? 'Update Booking' : 'Create Booking'}
                </button>
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
