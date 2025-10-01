'use client';

import { useSession } from '@/lib/auth-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';

export default function DashboardPage() {

  api.get('/protected/user')
  const { data: session } = useSession();

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-4'>
            {session?.user?.image ? (
              <div className='relative w-16 h-16 rounded-full overflow-hidden'>
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  fill
                  className='object-cover'
                />
              </div>
            ) : (
              <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
                <User className='w-8 h-8 text-primary' />
              </div>
            )}
            <div>
              <CardTitle className='text-2xl'>
                Bem-vindo, {session?.user?.name}!
              </CardTitle>
              <CardDescription>{session?.user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Você está logado no dashboard. Esta é a sua área pessoal.
          </p>
        </CardContent>
      </Card>

      {/* Dashboard Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-primary'>0</p>
            <p className='text-sm text-muted-foreground'>
              Nenhum projeto ainda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-primary'>0</p>
            <p className='text-sm text-muted-foreground'>Nenhuma avaliação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-primary'>0</p>
            <p className='text-sm text-muted-foreground'>Nenhuma notificação</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Suas atividades mais recentes aparecerão aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-12 text-muted-foreground'>
            <p>Nenhuma atividade recente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
