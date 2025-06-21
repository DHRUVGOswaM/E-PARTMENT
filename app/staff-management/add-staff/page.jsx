'use client'
import { useState } from 'react';

export default function AddStaff() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    role: '',
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('contact', formData.contact);
    data.append('role', formData.role);
    data.append('photo', formData.photo);

    const res = await fetch('/api/staff/add', {
      method: 'POST',
      body: data,
    });

    if (res.ok) {
      alert('Staff added successfully!');
    } else {
      alert('Failed to add staff');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">Add New Staff</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="contact" placeholder="Contact" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="role" placeholder="Role" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="photo" type="file" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
