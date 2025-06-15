// 'use client'

// import { useState, useEffect } from 'react'
// import { useUser } from '@clerk/nextjs'

// export default function EmergencyContactsPage() {
//   const [contacts, setContacts] = useState([])
//   const [name, setName] = useState('')
//   const [phoneNumber, setPhoneNumber] = useState('')
//   const [designation, setDesignation] = useState('')
//   const { user } = useUser()

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await fetch('/api/emergency-contacts')

//         if (!res.ok) {
//           const errorText = await res.text()
//           throw new Error(errorText || 'Failed to fetch contacts')
//         }

//         const data = await res.json()
//         if (Array.isArray(data)) {
//           setContacts(data)
//         } else {
//           setContacts([])
//         }
//       } catch (error) {
//         console.error('Fetch error:', error.message)
//         setContacts([])
//       }
//     }

//     fetchContacts()
//   }, [])

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!user) {
//       alert('User not logged in')
//       return
//     }

//     const email = ${designation}@epartment.com
//     const role = user.publicMetadata?.role || 'resident'
//     const userId = user.id

//     try {
//       const res = await fetch('/api/emergency-contacts', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name,
//           phoneNumber,
//           email,
//           role,
//           userId,
//         }),
//       })

//       const text = await res.text()

//       if (!res.ok) {
//         throw new Error(text || 'Failed to add contact')
//       }

//       const newContact = text ? JSON.parse(text) : null
//       if (newContact) {
//         setContacts((prev) => [...prev, newContact])
//         setName('')
//         setPhoneNumber('')
//         setDesignation('')
//       }
//     } catch (error) {
//       console.error('Submit error:', error.message)
//       alert(Error: ${error.message})
//     }
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4 text-center">Emergency & Community Contacts</h1>

//       <div className="bg-gray-100 p-4 rounded-xl shadow mb-6">
//         <h2 className="font-semibold mb-2">Add New Contact</h2>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input
//             type="text"
//             placeholder="Full Name"
//             className="w-full p-2 border rounded"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <input
//             type="text"
//             placeholder="Phone Number"
//             className="w-full p-2 border rounded"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             required
//           />
          
//           <input
//             type="text"
//             placeholder="Designation (e.g. Electrician)"
//             className="w-full p-2 border rounded"
//             value={designation}
//             onChange={(e) => setDesignation(e.target.value)}
//             required
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//           >
//             Save Contact
//           </button>
//         </form>
//       </div>

//       <div>
//         <h2 className="font-semibold mb-3">All Contacts</h2>
//         <ul className="space-y-2">
//           {contacts.map((contact) => (
//             <li
//               key={contact.id}
//               className="bg-white p-3 rounded shadow flex justify-between items-center"
//             >
//               <div>
//                 <p className="font-bold">{contact.name}</p>
//                 <p className="text-sm text-gray-600">{contact.email}</p>
//               </div>
//               <div className="text-blue-600 font-mono">{contact.phoneNumber}</div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [designation, setDesignation] = useState('')
  const [email, setEmail] = useState('')
  const { user } = useUser()

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/emergency-contacts')
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setContacts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Fetch error:', error.message)
        setContacts([])
      }
    }

    fetchContacts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('User not logged in')
      return
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
          userId: user.id,
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Emergency & Community Contacts</h1>

      <div className="bg-gray-100 p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-2">Add New Contact</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
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
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Save Contact
          </button>
        </form>
      </div>

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