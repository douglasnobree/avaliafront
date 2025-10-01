'use client';

import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function Header() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  return (
    <header className='border-b border-border bg-card'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Logo />
          <h1 className='text-xl md:text-2xl font-bold text-foreground'>
            Avalialrriga
          </h1>
        </div>
        <Button
          variant='outline'
          onClick={handleSignOut}
          className='flex items-center gap-2'>
          <LogOut className='w-4 h-4' />
          Sair
        </Button>
      </div>
    </header>
  );
}
