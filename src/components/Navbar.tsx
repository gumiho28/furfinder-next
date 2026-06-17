'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-[#003366] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-[0_2px_5px_rgba(0,0,0,0.2)]" style={{ padding: '1rem 2rem' }}>
      <div className="flex items-center text-xl font-bold gap-2">
        <i className="fas fa-paw text-[#d4af37]"></i> FurFinder
      </div>
      <ul className="flex gap-6 items-center m-0 p-0" style={{ listStyle: 'none' }}>
        <li><Link href="/" className="text-white hover:text-[#d4af37] transition font-semibold px-2 py-1">Home</Link></li>
        <li><Link href="/adopt" className="text-white hover:text-[#d4af37] transition font-semibold px-2 py-1">Adopt</Link></li>
        <li><Link href="/lost-and-found" className="text-white hover:text-[#d4af37] transition font-semibold px-2 py-1">Lost & Found</Link></li>
        <li><Link href="/shelters" className="text-white hover:text-[#d4af37] transition font-semibold px-2 py-1">Shelters</Link></li>
        <li><Link href="/donate" className="text-white hover:text-[#d4af37] transition font-semibold px-2 py-1">Donate</Link></li>
        
        {user ? (
          <>
            {user.email === 'admin@furfinder.com' ? (
              <li><Link href="/admin" className="hover:text-[#003366] bg-[#d4af37] transition font-semibold px-4 py-2 rounded-full">Admin Dashboard</Link></li>
            ) : (
              <li><Link href="/dashboard" className="hover:text-[#003366] bg-[#d4af37] transition font-semibold px-4 py-2 rounded-full">My Dashboard</Link></li>
            )}
            <li><button onClick={handleLogout} className="bg-transparent border border-[#d4af37] text-[#d4af37] px-4 py-1.5 rounded-full font-semibold hover:bg-[#d4af37] hover:text-[#003366] transition">Logout</button></li>
          </>
        ) : (
          <li><Link href="/login" className="bg-[#d4af37] text-[#003366] px-5 py-2 rounded-full font-bold hover:bg-white transition">Login / Signup</Link></li>
        )}
      </ul>
    </nav>
  )
}
