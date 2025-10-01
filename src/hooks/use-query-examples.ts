// Exemplo de hooks customizados usando TanStack React Query

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Exemplo de hook para buscar dados
export function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }
      return response.json();
    },
  });
}

// Exemplo de hook para buscar um usuário específico
export function useGetUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar usuário');
      }
      return response.json();
    },
    enabled: !!userId, // Só executa se userId existir
  });
}

// Exemplo de hook para criar dados
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: { name: string; email: string }) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar usuário');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalida e refetch a lista de usuários após criar um novo
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Exemplo de hook para atualizar dados
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ name: string; email: string }>;
    }) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar usuário');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
}

// Exemplo de hook para deletar dados
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar usuário');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalida a lista de usuários após deletar
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
