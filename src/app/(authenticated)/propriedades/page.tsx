'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import api from '@/lib/api';

interface Property {
  id: string;
  nome: string;
  proprietario: string;
  municipio: string;
  estado: string;
  area_total: number;
  area_irrigada: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await api.get('/property/my-properties');
      // O backend retorna { success: true, data: [...], ... }
      const data = response.data?.data || response.data || [];
      setProperties(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Erro ao carregar propriedades:', error);
      toast.error('Erro ao carregar propriedades');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Minhas Propriedades</h1>
          <p className='text-muted-foreground mt-2'>
            Gerencie todas as suas propriedades cadastradas
          </p>
        </div>
        <Link href='/criar-propriedade'>
          <Button>
            <Plus className='w-4 h-4 mr-2' />
            Nova Propriedade
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <MapPin className='w-12 h-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-semibold mb-2'>
              Nenhuma propriedade cadastrada
            </h3>
            <p className='text-muted-foreground text-center mb-4'>
              Comece cadastrando sua primeira propriedade
            </p>
            <Link href='/criar-propriedade'>
              <Button>
                <Plus className='w-4 h-4 mr-2' />
                Cadastrar Propriedade
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {properties.map((property) => (
            <Card
              key={property.id}
              className='cursor-pointer hover:shadow-md transition-shadow'
              onClick={() =>
                router.push(`/propriedades/${property.id}`)
              }>
              <CardHeader>
                <CardTitle className='text-xl'>{property.nome}</CardTitle>
                <CardDescription>
                  <div className='flex items-center gap-1'>
                    <MapPin className='w-4 h-4' />
                    {property.municipio} - {property.estado}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Proprietário:</span>
                    <span className='font-medium'>{property.proprietario}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Área Total:</span>
                    <span className='font-medium'>
                      {property.area_total} ha
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Área Irrigada:
                    </span>
                    <span className='font-medium'>
                      {property.area_irrigada} ha
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
