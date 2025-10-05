# Measurement Grid - Estrutura Modularizada

## 📁 Estrutura de Arquivos

```
components/measurement-grid/
├── index.tsx                 (86 linhas)  - Componente principal
├── types.ts                  (17 linhas)  - Interfaces e tipos
├── hooks/
│   ├── use-grid-state.ts     (59 linhas)  - Estado do grid
│   └── use-grid-actions.ts   (82 linhas)  - Ações (add/remove/save)
├── components/
│   ├── grid-controls.tsx     (34 linhas)  - Botões add/remove coluna
│   ├── grid-display.tsx      (64 linhas)  - Renderização do grid
│   ├── grid-stats.tsx        (48 linhas)  - Estatísticas e legendas
│   └── measurement-modal.tsx (155 linhas) - Modal de medição
└── utils/
    ├── calculations.ts       (24 linhas)  - Cálculos de vazão
    └── labels.ts             (20 linhas)  - Funções de labels
```

**Total: 589 linhas** (antes era 400 linhas em 1 arquivo)

## 🎯 Vantagens da Refatoração

### ✅ Organização
- Cada arquivo tem uma responsabilidade única
- Fácil de encontrar código específico
- Nomes descritivos e claros

### ✅ Manutenção
- Mudanças isoladas não afetam outros arquivos
- Testes unitários mais simples
- Debugging mais fácil

### ✅ Reutilização
- Hooks podem ser usados em outros componentes
- Utils são funções puras reutilizáveis
- Sub-componentes independentes

### ✅ Legibilidade
- Arquivos pequenos (20-155 linhas)
- Código limpo e focado
- Imports explícitos mostram dependências

## 📦 Como Usar

```tsx
import { MeasurementGrid } from '@/components/measurement-grid';

function NovaAvaliacao() {
  const [gridPoints, setGridPoints] = useState([]);
  
  return (
    <MeasurementGrid
      onGridChange={setGridPoints}
      initialGrid={gridPoints}
    />
  );
}
```

## 🔧 Componentes

### `index.tsx` - Componente Principal
- Orquestra todos os sub-componentes
- Gerencia estado do modal
- Conecta hooks e componentes

### `types.ts` - Definições
- `GridPoint`: Dados de um ponto do grid
- `MeasurementGridProps`: Props do componente principal
- `MeasurementFormData`: Dados do formulário do modal

### Hooks

#### `use-grid-state.ts`
- Gerencia estado do grid (linhas, emissores, pontos)
- Inicialização do grid
- Contadores (medidos, total, vazões)

#### `use-grid-actions.ts`
- Adicionar coluna de emissores
- Remover última coluna
- Salvar medição em um ponto
- Remover medição de um ponto

### Componentes UI

#### `grid-controls.tsx`
- Botões para adicionar/remover colunas
- Desabilita "remover" quando está no mínimo (4)

#### `grid-display.tsx`
- Renderiza o grid de bolinhas
- Labels de linhas e emissores
- Click handler para abrir modal

#### `grid-stats.tsx`
- Legenda (medido/não medido)
- Média de vazão
- Avisos de progresso

#### `measurement-modal.tsx`
- Modal para inserir volume e tempo
- Cálculo automático de vazão
- Botões salvar/remover

### Utils

#### `calculations.ts`
- `calculateVazao()`: Converte mL/s em L/h
- `calculateMediaVazao()`: Calcula média das vazões

#### `labels.ts`
- `getLinhaLabel()`: Formata label da linha (1ª, 1/3, 2/3, Últ.)
- `getEmissorLabel()`: Formata label do emissor

## 🎨 Fluxo de Dados

```
index.tsx
  ├─ useGridState() → Mantém estado do grid
  ├─ useGridActions() → Ações para modificar grid
  │
  ├─ GridControls
  │   └─ onClick → addColumn() / removeLastColumn()
  │
  ├─ GridDisplay
  │   └─ onPointClick → Abre MeasurementModal
  │
  ├─ GridStats
  │   └─ Exibe estatísticas em tempo real
  │
  └─ MeasurementModal
      ├─ calculateVazao() → Calcula automaticamente
      └─ onSave → saveMeasurement() / removeMeasurement()
```

## 🚀 Próximos Passos

Se precisar adicionar funcionalidades:

1. **Nova estatística?** → Adicione em `grid-stats.tsx`
2. **Novo cálculo?** → Adicione em `utils/calculations.ts`
3. **Nova ação?** → Adicione em `hooks/use-grid-actions.ts`
4. **Novo campo no modal?** → Edite `measurement-modal.tsx`
5. **Mudar aparência do grid?** → Edite `grid-display.tsx`

## 📝 Convenções

- **Hooks**: Começam com `use-` e retornam objeto com funções/valores
- **Components**: PascalCase, exportados como named exports
- **Utils**: camelCase, funções puras
- **Types**: PascalCase para interfaces, camelCase para propriedades
