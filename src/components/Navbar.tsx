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
    <nav className="bg-[#003366] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
      <div className="flex items-center text-xl font-bold gap-2">
        <i className="fas fa-paw text-[#d4af37]"></i> FurFinder
      </div>
      <ul className="flex gap-4 items-center">
        <li><Link href="/" className="hover:text-[#d4af37] transition font-semibold">Home</Link></li>
        <li><Link href="/adopt" className="hover:text-[#d4af37] transition font-semibold">Adopt</Link></li>
        <li><Link href="/lost-and-found" className="hover:text-[#d4af37] transition font-semibold">Lost & Found</Link></li>
        
        {user ? (
          <>
            <li><Link href="/dashboard" className="hover:text-[#d4af37] transition font-semibold">Dashboard</Link></li>
            <li><button onClick={handleLogout} className="bg-[#d4af37] text-[#003366] px-4 py-2 rounded-full font-semibold hover:opacity-90">Logout</button></li>
          </>
        ) : (
          <li><Link href="/login" className="bg-[#d4af37] text-[#003366] px-4 py-2 rounded-full font-semibold hover:opacity-90">Sign In</Link></li>
        )}
      </ul>
    </nav>
  )
}
