
'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [designation, setDesignation] = useState('')
  const [email, setEmail] = useState('')
  const [userData, setUserData] = useState(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/emergency-contacts')
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setContacts(Array.isArray(data.contacts) ? data.contacts : [])
        setUserData(data.user) // contains role and societyId
      } catch (error) {
        console.error('Fetch error:', error.message)
        setContacts([])
      }
    }

    fetchContacts()
  }, [])

  const isAdmin = userData?.role === 'SOCIETY_ADMIN' || userData?.role === 'SUPER_ADMIN' || userData?.role === 'SOCIETY_SECRETARY'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !isAdmin) {
      alert('You are not authorized to add contacts')
      return
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }

    try {
      const res = await fetch('/api/emergency-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phoneNumber,
          email,
          designation,
        }),
      })

      const text = await res.text()
      if (!res.ok) throw new Error(text || 'Failed to add contact')

      const newContact = text ? JSON.parse(text) : null
      if (newContact) {
        setContacts((prev) => [...prev, newContact])
        setName('')
        setPhoneNumber('')
        setEmail('')
        setDesignation('')
      }
    } catch (error) {
      console.error('Submit error:', error.message)
      alert(`Error: ${error.message}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Emergency & Community Contacts</h1>

      {isAdmin && (
        <div className="bg-gray-100 p-4 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Add New Contact</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              className={`w-full p-2 border rounded ${phoneError ? 'border-red-500' : ''}`}
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                if (value.length <= 10) {
                  setPhoneNumber(value);
                  setPhoneError('');
                  if (value.length === 10 && !/^[6-9]/.test(value)) {
                    setPhoneError('Mobile number must start with 6, 7, 8, or 9');
                  }
                }
              }}
              maxLength={10}
              required
            />
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Designation (e.g. Electrician)"
              className="w-full p-2 border rounded"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Save Contact
            </button>
          </form>
        </div>
      )}

      <div>
        <h2 className="font-semibold mb-3">All Contacts</h2>
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="bg-white p-3 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{contact.name}</p>
                <p className="text-sm text-gray-600">{contact.email}</p>
                <p className="text-sm text-gray-500">{contact.designation}</p>
              </div>
              <div className="text-blue-600 font-mono">{contact.phoneNumber}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
