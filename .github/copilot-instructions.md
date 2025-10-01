# Instruções para o GitHub Copilot

Sempre considere o arquivo `LLM-CONTEXT.md` na raiz do projeto como referência principal para:
- Stack tecnológico
- Convenções de código
- Estrutura de diretórios
- Padrões de implementação

## Tecnologias Principais
- Next.js 15.5.3 (App Router)
- React 19.1.0
- TypeScript
- Tailwind CSS 4.x
- shadcn/ui (New York style)
- Better Auth 1.3.18
- TanStack Query 5.90.2

## Convenções
- Use sempre path alias `@/` para imports
- Componentes em PascalCase
- Hooks customizados em `@/hooks`
- Estilização com Tailwind + utilitário `cn()`