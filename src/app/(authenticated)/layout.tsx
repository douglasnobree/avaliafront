'use client';

import { useSession, authClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layouts/header';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingOrganization, setCheckingOrganization] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Redirect to login if not authenticated
      if (!isPending && !session) {
        router.push('/login');
        return;
      }

      // Páginas que não devem ter verificação
      const skipPages = ['/criar-organizacao', '/criar-propriedade'];
      const shouldSkip = skipPages.some((page) => pathname?.includes(page));

      // Se está autenticado, verifica se tem organização e propriedade
      if (!isPending && session && !shouldSkip) {
        try {
          // 1. Busca as organizações do usuário
          const organizationsResult = await authClient.organization.list();

          if (organizationsResult.error) {
            console.error(
              'Erro ao buscar organizações:',
              organizationsResult.error
            );
            setCheckingOrganization(false);
            return;
          }

          const organizations = organizationsResult.data;

          // Se não tem nenhuma organização, redireciona para criar
          if (!organizations || organizations.length === 0) {
            router.push('/criar-organizacao');
            return;
          }

          // 2. Verifica se tem propriedades
          try {
            const propertiesResponse = await api.get('/property/my-properties');
            const properties = propertiesResponse.data;

            // Se não tem nenhuma propriedade, redireciona para criar
            if (!properties || properties.length === 0) {
              router.push('/criar-propriedade');
              return;
            }
          } catch (error) {
            console.error('Erro ao verificar propriedades:', error);
            // Se der erro na API, continua normalmente
          }

          setCheckingOrganization(false);
        } catch (error) {
          console.error('Erro ao verificar organizações:', error);
          setCheckingOrganization(false);
        }
      } else {
        setCheckingOrganization(false);
      }
    };

    checkAuthentication();
  }, [session, isPending, router, pathname]);

  // Show loading state while checking authentication or organization
  if (isPending || checkingOrganization) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  );
}
