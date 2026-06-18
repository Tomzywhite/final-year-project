'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export function LogoutButton({ className, variant = 'primary', children }: { className?: string, variant?: any, children?: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button variant={variant} onClick={handleLogout} className={className}>
      {children || 'Log Out'}
    </Button>
  )
}
