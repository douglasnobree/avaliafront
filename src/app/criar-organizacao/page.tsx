'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { authClient, useSession } from '@/lib/auth-client';

// Schema de validação
const createOrganizationSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  slug: z
    .string()
    .min(3, 'O slug deve ter pelo menos 3 caracteres')
    .regex(
      /^[a-z0-9-]+$/,
      'O slug deve conter apenas letras minúsculas, números e hífens'
    ),
});

type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;

export default function CreateOrganizationPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
  });

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  const nameValue = watch('name');

  // Gerar slug automaticamente baseado no nome
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .replace(/^-|-$/g, ''); // Remove hífens do início e fim

    setValue('slug', slug);
  };

  const onSubmit = async (data: CreateOrganizationFormData) => {
    setLoading(true);

    try {
      // Usando o plugin organizationClient do Better Auth
      const result = await authClient.organization.create({
        name: data.name,
        slug: data.slug,
      });

      if (result.error) {
        toast.error(result.error.message || 'Erro ao criar organização');
        setLoading(false);
        return;
      }

      toast.success('Organização criada com sucesso!');
      // Redireciona para criar a primeira propriedade
      router.push('/criar-propriedade');
    } catch (error: any) {
      console.error('Erro ao criar organização:', error);
      toast.error(error?.message || 'Erro ao criar organização');
      setLoading(false);
    }
  };

  // Mostra loading enquanto verifica autenticação
  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  // Não renderiza nada se não estiver autenticado (vai redirecionar)
  if (!session) {
    return null;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4 py-8'>
      <div className='w-full max-w-lg space-y-8'>
        {/* Logo */}
        <div className='flex flex-col items-center space-y-4'>
          <Logo width={100} height={100} />
          <h1 className='text-2xl md:text-3xl font-bold text-yellow-600 text-center'>
            Avalia Irriga
          </h1>
        </div>

        {/* Create Organization Form */}
        <Card>
          <CardHeader className='space-y-2'>
            <CardTitle className='text-2xl'>Criar Organização</CardTitle>
            <CardDescription>
              Para começar a usar o sistema, você precisa criar uma organização.
              Uma organização permite que você gerencie seus projetos e equipes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* Organization Name */}
              <div className='space-y-2'>
                <Label htmlFor='name'>Nome da Organização</Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Ex: Minha Empresa'
                  {...register('name')}
                  onChange={(e) => {
                    register('name').onChange(e);
                    handleNameChange(e);
                  }}
                  className='h-12 text-base'
                />
                {errors.name && (
                  <p className='text-sm text-red-500'>{errors.name.message}</p>
                )}
              </div>

              {/* Organization Slug */}
              <div className='space-y-2'>
                <Label htmlFor='slug'>Slug da Organização</Label>
                <Input
                  id='slug'
                  type='text'
                  placeholder='Ex: minha-empresa'
                  {...register('slug')}
                  className='h-12 text-base font-mono'
                />
                <p className='text-xs text-muted-foreground'>
                  O slug será usado na URL da sua organização. Use apenas letras
                  minúsculas, números e hífens.
                </p>
                {errors.slug && (
                  <p className='text-sm text-red-500'>{errors.slug.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={loading}
                className='w-full h-12 text-base font-semibold'>
                {loading ? (
                  <Loader2 className='w-5 h-5 animate-spin' />
                ) : (
                  'Criar Organização'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Text */}
        <p className='text-sm text-center text-muted-foreground'>
          Você poderá criar mais organizações depois no painel de controle.
        </p>
      </div>
    </div>
  );
}
