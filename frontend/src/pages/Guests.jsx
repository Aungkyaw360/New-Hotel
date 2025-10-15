import { useState, useEffect } from 'react';
import { guestsAPI } from '../services/api';
import { Plus, Edit, Trash2, X, Mail, Phone } from 'lucide-react';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    id_number: '',
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await guestsAPI.getAll();
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGuest) {
        await guestsAPI.update(editingGuest.id, formData);
      } else {
        await guestsAPI.create(formData);
      }
      fetchGuests();
      closeModal();
    } catch (error) {
      console.error('Error saving guest:', error);
      alert(error.response?.data?.error || 'Error saving guest. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await guestsAPI.delete(id);
        fetchGuests();
      } catch (error) {
        console.error('Error deleting guest:', error);
        alert('Error deleting guest. Please try again.');
      }
    }
  };

  const openModal = (guest = null) => {
    if (guest) {
      setEditingGuest(guest);
      setFormData({
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email,
        phone: guest.phone,
        address: guest.address || '',
        id_number: guest.id_number || '',
      });
    } else {
      setEditingGuest(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        id_number: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGuest(null);
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
        <h1 className="text-3xl font-bold text-gray-900">Guests</h1>
        <button onClick={() => openModal()} className="btn btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Guest
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guests.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No guests registered yet</p>
          </div>
        ) : (
          guests.map((guest) => (
            <div key={guest.id} className="card hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {guest.first_name} {guest.last_name}
                </h3>
                {guest.id_number && (
                  <p className="text-xs text-gray-500">ID: {guest.id_number}</p>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {guest.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {guest.phone}
                </div>
                {guest.address && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span> {guest.address}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Registered: {new Date(guest.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(guest)}
                  className="btn btn-secondary flex-1 flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(guest.id)}
                  className="btn btn-danger flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingGuest ? 'Edit Guest' : 'Add New Guest'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">First Name</label>
                <input
                  type="text"
                  className="input"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Last Name</label>
                <input
                  type="text"
                  className="input"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Address</label>
                <textarea
                  className="input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">ID Number</label>
                <input
                  type="text"
                  className="input"
                  value={formData.id_number}
                  onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                  placeholder="Passport or ID number"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingGuest ? 'Update Guest' : 'Add Guest'}
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

export default Guests;
