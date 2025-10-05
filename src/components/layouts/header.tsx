'use client';

import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, MapPin } from 'lucide-react';
import Link from 'next/link';

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
    <header className='border-b border-border bg-card sticky top-0 z-50'>
      <div className='container mx-auto px-3 sm:px-4 py-3 md:py-4'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-3 md:gap-8 min-w-0 flex-1'>
            <Link href='/dashboard' className='flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity min-w-0'>
              <Logo width={40} height={40} className="flex-shrink-0 md:w-[50px] md:h-[50px]" />
              <h1 className='text-base sm:text-lg md:text-2xl font-bold text-green-600 truncate'>
                Avalia Irriga
              </h1>
            </Link>

            <nav className='hidden md:flex items-center gap-2 lg:gap-4'>
              <Link href='/dashboard'>
                <Button variant='ghost' size="sm" className='flex items-center gap-2'>
                  <LayoutDashboard className='w-4 h-4' />
                  Dashboard
                </Button>
              </Link>
              <Link href='/propriedades'>
                <Button variant='ghost' size="sm" className='flex items-center gap-2'>
                  <MapPin className='w-4 h-4' />
                  Propriedades
                </Button>
              </Link>
            </nav>
          </div>

          <Button
            variant='outline'
            size="sm"
            onClick={handleSignOut}
            className='flex items-center gap-2 flex-shrink-0'>
            <LogOut className='w-3 h-3 md:w-4 md:h-4' />
            <span className='hidden sm:inline text-xs md:text-sm'>Sair</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <nav className='flex md:hidden items-center gap-2 mt-3 border-t pt-3'>
          <Link href='/dashboard' className="flex-1">
            <Button variant='ghost' size="sm" className='w-full flex items-center justify-center gap-2 text-xs'>
              <LayoutDashboard className='w-3 h-3' />
              Dashboard
            </Button>
          </Link>
          <Link href='/propriedades' className="flex-1">
            <Button variant='ghost' size="sm" className='w-full flex items-center justify-center gap-2 text-xs'>
              <MapPin className='w-3 h-3' />
              Propriedades
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
