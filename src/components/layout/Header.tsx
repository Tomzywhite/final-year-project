'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Profile } from '@/types'

export function Header({ user }: { user: Profile }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="flex h-16 md:h-16 flex-shrink-0 items-center justify-between border-b bg-white px-4 md:px-6 z-10 w-full">
      <div className="flex items-center gap-2 md:gap-4 overflow-hidden mr-4">
        <h2 className="text-sm md:text-lg font-medium text-slate-800 truncate">
          Welcome, {user.full_name.split(' ')[0]}
        </h2>
        <span className="hidden sm:inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 capitalize">
          {user.role}
        </span>
      </div>
      <Button variant="secondary" onClick={handleLogout} className="h-9 px-4">
        Log Out
      </Button>
    </header>
  )
}
