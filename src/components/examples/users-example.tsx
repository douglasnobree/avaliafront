'use client';

import {
  useGetUsers,
  useCreateUser,
  useDeleteUser,
} from '@/hooks/use-query-examples';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Exemplo de componente usando React Query
export default function UsersExample() {
  // Hook para buscar usuários
  const { data: users, isLoading, isError, error } = useGetUsers();

  // Hook para criar usuário
  const createUser = useCreateUser();

  // Hook para deletar usuário
  const deleteUser = useDeleteUser();

  const handleCreateUser = () => {
    createUser.mutate(
      {
        name: 'Novo Usuário',
        email: 'novo@email.com',
      },
      {
        onSuccess: () => {
          console.log('Usuário criado com sucesso!');
        },
        onError: (error) => {
          console.error('Erro ao criar usuário:', error);
        },
      }
    );
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser.mutate(userId, {
      onSuccess: () => {
        console.log('Usuário deletado com sucesso!');
      },
      onError: (error) => {
        console.error('Erro ao deletar usuário:', error);
      },
    });
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='w-6 h-6 animate-spin' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='text-red-500 p-4'>
        Erro: {error instanceof Error ? error.message : 'Erro desconhecido'}
      </div>
    );
  }

  return (
    <div className='p-4 space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Usuários</h1>
        <Button onClick={handleCreateUser} disabled={createUser.isPending}>
          {createUser.isPending ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            'Criar Usuário'
          )}
        </Button>
      </div>

      <div className='space-y-2'>
        {users?.map((user: any) => (
          <div
            key={user.id}
            className='flex justify-between items-center p-4 border rounded-lg'>
            <div>
              <p className='font-medium'>{user.name}</p>
              <p className='text-sm text-muted-foreground'>{user.email}</p>
            </div>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => handleDeleteUser(user.id)}
              disabled={deleteUser.isPending}>
              {deleteUser.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                'Deletar'
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
