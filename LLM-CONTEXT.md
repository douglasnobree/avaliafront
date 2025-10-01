# Contexto do Projeto IrrigaAi - AvaliaFront

> **Documento de contexto para LLMs**  
> Este arquivo fornece informações essenciais sobre a estrutura, tecnologias e convenções do projeto para facilitar a compreensão e geração de código adequado.

---

## 📋 Visão Geral

**Nome do Projeto:** AvaliaFront  
**Tipo:** Aplicação Web Frontend  
**Domínio:** Sistema de avaliação e irrigação inteligente (IrrigaAi)  
**Repositório:** douglasnobree/avaliafront  
**Branch Principal:** master

---

## 🛠️ Stack Tecnológico

### Framework & Runtime
- **Next.js 15.5.3** (App Router)
- **React 19.1.0**
- **TypeScript 5.x**
- **Node.js** (ES2017 target)

### Estilização & UI
- **Tailwind CSS 4.x** (PostCSS)
- **shadcn/ui** (New York style)
  - Configuração: `components.json`
  - BaseColor: neutral
  - CSS Variables habilitadas
  - Sem prefix
- **Radix UI** (primitivos de componentes)
  - `@radix-ui/react-checkbox`
  - `@radix-ui/react-label`
  - `@radix-ui/react-slot`
- **Lucide React** (ícones)
- **class-variance-authority** (variantes de componentes)
- **clsx** + **tailwind-merge** (utilitários de className)
- **tw-animate-css** (animações)

### Gerenciamento de Estado & Dados
- **TanStack Query (React Query) 5.90.2**
  - Provider: `QueryProvider` em `src/components/providers/query-provider.tsx`
  - DevTools habilitadas: `@tanstack/react-query-devtools`
- **Axios 1.12.2** (cliente HTTP)
  - Configuração base em `src/lib/api.ts`
  - Base URL: `http://localhost:3333`
  - Credenciais habilitadas: `withCredentials: true`

### Autenticação
- **Better Auth 1.3.18**
  - Cliente configurado em `src/lib/auth-client.ts`
  - Plugins ativos:
    - `organizationClient()` (gerenciamento de organizações)
    - `adminClient()` (funcionalidades administrativas)
  - Base URL: `process.env.NEXT_PUBLIC_API_BASE_URL` (fallback: `http://localhost:3333`)
  - Métodos exportados: `signIn`, `signOut`, `signUp`, `useSession`

### Formulários & Validação
- **React Hook Form 7.63.0**
- **Zod 4.1.11** (schema validation)
- **@hookform/resolvers 5.2.2** (integração Zod + RHF)

### Notificações
- **Sonner 2.0.7** (toast notifications)

---

## 📁 Estrutura de Diretórios

```
avaliafront/
├── public/                          # Assets estáticos
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg
│
├── src/
│   ├── app/                         # App Router (Next.js 15)
│   │   ├── layout.tsx              # Layout raiz (QueryProvider, fontes Geist)
│   │   ├── page.tsx                # Página inicial
│   │   ├── globals.css             # Estilos globais (Tailwind)
│   │   │
│   │   ├── (authenticated)/        # Grupo de rotas autenticadas
│   │   │   ├── layout.tsx          # Layout para rotas autenticadas
│   │   │   └── dashboard/
│   │   │       └── page.tsx        # Dashboard principal
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx            # Página de login
│   │   │
│   │   └── criar-conta/
│   │       └── page.tsx            # Página de registro
│   │
│   ├── components/
│   │   ├── ui/                     # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   │
│   │   ├── layouts/
│   │   │   └── header.tsx          # Cabeçalho da aplicação
│   │   │
│   │   ├── providers/
│   │   │   └── query-provider.tsx  # Provider do React Query
│   │   │
│   │   ├── examples/
│   │   │   └── users-example.tsx   # Exemplo de uso
│   │   │
│   │   ├── logo.tsx                # Componente de logo
│   │   ├── sign-in.tsx             # Componente de login
│   │   └── sign-up.tsx             # Componente de cadastro
│   │
│   ├── hooks/
│   │   └── use-query-examples.ts   # Hooks customizados do React Query
│   │
│   └── lib/
│       ├── api.ts                  # Configuração do Axios
│       ├── auth-client.ts          # Cliente Better Auth
│       └── utils.ts                # Utilitários (cn, etc)
│
├── components.json                  # Configuração shadcn/ui
├── tsconfig.json                    # Configuração TypeScript
├── next.config.ts                   # Configuração Next.js
├── postcss.config.mjs              # Configuração PostCSS
└── package.json                     # Dependências e scripts
```

---

## 🎨 Convenções de Código

### TypeScript
- **Target:** ES2017
- **Modo Strict:** Habilitado
- **Module Resolution:** bundler
- **JSX:** preserve
- **Path Aliases:**
  - `@/*` → `./src/*`

### Componentes
- **Padrão:** Componentes funcionais com TypeScript
- **Nomenclatura:** PascalCase para componentes
- **Estilização:** Tailwind CSS com utilitário `cn()` (de `@/lib/utils`)
- **UI Library:** shadcn/ui (New York style) com Radix UI

### Organização de Rotas
- **App Router:** Next.js 15 App Directory
- **Grupos de Rotas:** 
  - `(authenticated)` para rotas protegidas
- **Layouts:** Layouts aninhados para diferentes seções
- **Linguagem:** pt-BR (lang='pt-BR' no layout raiz)

### Autenticação
- **Biblioteca:** Better Auth
- **Padrão:** Hook `useSession()` para verificar autenticação
- **Funções:** `signIn`, `signOut`, `signUp` do auth-client
- **Plugins:** Suporte a organizações e recursos de admin

### API & Fetching
- **Cliente HTTP:** Axios com instância configurada em `@/lib/api`
- **State Management:** TanStack Query (React Query)
- **Padrão de Hooks:** Custom hooks em `@/hooks` para queries
- **Base URL da API:** `http://localhost:3333` (desenvolvimento)

### Estilos
- **Framework:** Tailwind CSS 4.x
- **Sistema de Design:** shadcn/ui (New York)
- **Cor Base:** neutral
- **Fontes:** Geist Sans + Geist Mono (Google Fonts)
- **Ícones:** Lucide React
- **Animações:** tw-animate-css

---

## 🔧 Variáveis de Ambiente

### Variáveis Esperadas
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333  # URL da API backend
```

---

## 📦 Scripts Disponíveis

```bash
npm run dev    # Servidor de desenvolvimento (Next.js)
npm run build  # Build de produção
npm run start  # Servidor de produção
```

---

## 🔐 Autenticação & Autorização

### Better Auth
- **Configuração:** `src/lib/auth-client.ts`
- **Features:**
  - Sistema de sessões
  - Organizações (multi-tenant)
  - Controle de acesso admin
  - Integração com React hooks

### Rotas Protegidas
- Grupo `(authenticated)` requer autenticação
- Layout dedicado em `src/app/(authenticated)/layout.tsx`
- Verificação com `useSession()`

---

## 📝 Padrões de Importação

```typescript
// Aliases configurados
import Component from '@/components/component'
import { api } from '@/lib/api'
import { authClient, useSession } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
```

---

## 🎯 Features Principais

1. **Sistema de Autenticação**
   - Login e cadastro com Better Auth
   - Gerenciamento de sessões
   - Suporte a organizações

2. **Dashboard Autenticado**
   - Área protegida para usuários logados
   - Integração com API backend

3. **Componentes Reutilizáveis**
   - Biblioteca shadcn/ui (New York style)
   - Componentes customizados de UI
   - Sistema consistente de design

4. **Integração com API**
   - Cliente Axios configurado
   - React Query para gerenciamento de estado
   - Suporte a credenciais (cookies/sessions)

---

## 💡 Dicas para LLMs

### Ao criar novos componentes:
- Use TypeScript com tipagem estrita
- Aplique Tailwind CSS com o utilitário `cn()`
- Prefira componentes shadcn/ui quando aplicável
- Use path alias `@/` para imports

### Ao trabalhar com autenticação:
- Importe `useSession` de `@/lib/auth-client`
- Use Better Auth plugins quando necessário
- Lembre-se da estrutura de rotas `(authenticated)`

### Ao fazer requisições API:
- Importe a instância `api` de `@/lib/api`
- Use React Query para gerenciamento de estado
- Crie hooks customizados em `@/hooks` para queries reutilizáveis

### Ao estilizar:
- Siga o sistema New York do shadcn/ui
- Use variáveis CSS do Tailwind
- Mantenha consistência com componentes existentes em `@/components/ui`

---

## 🌐 Contexto do Domínio

**IrrigaAi** é um sistema inteligente de avaliação e irrigação. Este frontend (`avaliafront`) é a interface web para:
- Gerenciamento de usuários e autenticação
- Dashboard de monitoramento
- Avaliações e análises
- Controle de irrigação

---

**Última atualização:** 1 de outubro de 2025
