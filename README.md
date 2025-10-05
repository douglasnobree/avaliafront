# 🌱 AVAlia Frontend

> Interface web moderna e responsiva para o sistema de avaliação de irrigação AVAlia.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📱 Features

- ✅ **100% Responsivo** - Mobile, Tablet, Desktop
- ✅ **Next.js 15** - App Router com React Server Components
- ✅ **TypeScript** - Type-safe em todo o projeto
- ✅ **Tailwind CSS** - Estilização moderna e performática
- ✅ **shadcn/ui** - Componentes UI de alta qualidade
- ✅ **TanStack Query** - State management e cache inteligente
- ✅ **Better Auth** - Autenticação segura
- ✅ **Three.js** - Visualizações 3D interativas

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15.5.3
- **UI Library:** React 19.1.0
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x
- **Components:** shadcn/ui (Radix UI)
- **State:** TanStack Query 5.x
- **HTTP Client:** Axios 1.x
- **Forms:** React Hook Form + Zod
- **3D Graphics:** Three.js + React Three Fiber
- **Charts:** Recharts

## 📁 Estrutura

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (authenticated)/    # Rotas protegidas
│   │   ├── dashboard/
│   │   └── propriedades/
│   ├── login/
│   └── criar-conta/
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # shadcn/ui components
│   ├── layouts/            # Layouts (Header, etc)
│   └── measurement-grid/   # Grid de medição
├── lib/                    # Utilitários e configs
│   ├── api.ts              # Cliente Axios
│   ├── auth-client.ts      # Better Auth
│   └── utils.ts            # Helpers
└── hooks/                  # Custom hooks
```

## 🎨 Responsividade

O site é totalmente responsivo seguindo padrões mobile-first:

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

Veja o [Guia de Responsividade](../GUIA-RESPONSIVIDADE.md) para mais detalhes.

## 🧪 Scripts

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Lint
npm run lint
```

## 📚 Documentação

- [Guia de Responsividade](../GUIA-RESPONSIVIDADE.md)
- [Melhorias Implementadas](../MELHORIAS-IMPLEMENTADAS.md)
- [Comandos Úteis](../COMANDOS-UTEIS.md)
- [README Completo](../README-COMPLETO.md)

## 🌐 Deploy

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Fazer upload da pasta .next
```

## 🤝 Contribuindo

Veja o [README principal](../README-COMPLETO.md) para guidelines de contribuição.

## 📄 Licença

MIT - Veja [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ usando Next.js e TypeScript**
