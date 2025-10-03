# 🗺️ Mapa de Navegação - Sistema AvaliaIrriga

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              🏠 DASHBOARD                                │
│                         /dashboard (page.tsx)                            │
│                                                                           │
│  [Bem-vindo] [Nova Propriedade] [Projetos: 0] [Avaliações: 0]           │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ├─► HEADER: Propriedades
                                 │
┌────────────────────────────────▼────────────────────────────────────────┐
│                          📍 PROPRIEDADES                                 │
│                      /propriedades (page.tsx)                            │
│                                                                           │
│  [Lista de Propriedades em Grid 3 colunas]                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Fazenda 1    │  │ Fazenda 2    │  │ [+ Nova]     │                  │
│  │ Local        │  │ Local        │  │              │                  │
│  │ 100 ha       │  │ 50 ha        │  │              │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ CLIQUE EM PROPRIEDADE
                                 │
┌────────────────────────────────▼────────────────────────────────────────┐
│                      📋 DETALHES DA PROPRIEDADE                          │
│              /propriedades/[id]/page.tsx ✨ NOVA                         │
│                                                                           │
│  ┌─────────────────────┐  ┌─────────────────────┐                      │
│  │ Info Proprietário   │  │ Dados Propriedade   │                      │
│  │ - Nome              │  │ - Área Total        │                      │
│  │ - Telefone          │  │ - Área Irrigada     │                      │
│  │ - Email             │  │ - Coordenadas       │                      │
│  └─────────────────────┘  └─────────────────────┘                      │
│                                                                           │
│  ┌──────────────────────────────────────────────────────┐               │
│  │ 🌾 ÁREAS DA FAZENDA              [+ Nova Área]       │               │
│  │                                                       │               │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐             │               │
│  │  │ Área 1  │  │ Área 2  │  │ Área 3  │             │               │
│  │  │ 15.5 ha │  │ 12 ha   │  │ 20 ha   │             │               │
│  │  │ CUD:90% │  │ CUD:85% │  │ Sem     │             │               │
│  │  │ CUC:92% │  │ CUC:88% │  │ aval.   │             │               │
│  │  └─────────┘  └─────────┘  └─────────┘             │               │
│  └──────────────────────────────────────────────────────┘               │
└──────────┬──────────────┬──────────────────────────────────────────────┘
           │              │
           │              └─► [+ Nova Área]
           │                  │
           │                  ▼
           │         ┌────────────────────────────────┐
           │         │   ➕ CRIAR NOVA ÁREA            │
           │         │   /propriedades/[id]/          │
           │         │   criar-area/page.tsx ✨ NOVA  │
           │         │                                 │
           │         │   📝 Formulário:                │
           │         │   - Nome/Identificação          │
           │         │   - Área (hectares)             │
           │         │   [Cancelar] [Criar Área]       │
           │         └────────────────────────────────┘
           │
           │ CLIQUE EM ÁREA
           │
┌──────────▼──────────────────────────────────────────────────────────────┐
│                         📊 DETALHES DA ÁREA                              │
│        /propriedades/[id]/areas/[areaId]/page.tsx ✨ NOVA               │
│                                                                           │
│  Área 1 - 15.5 hectares                          [Voltar] [Nova Aval.]  │
│                                                                           │
│  ┌──────────────┐  ┌──────────┐  ┌──────────┐                          │
│  │ Última Aval. │  │ CUD      │  │ CUC      │                          │
│  │ 02/10/2025   │  │ 90.8% 🟢 │  │ 92.3% 🟢 │                          │
│  └──────────────┘  └──────────┘  └──────────┘                          │
│                                                                           │
│  ┌──────────────────────────────────────────────────────┐               │
│  │ 📈 VER RELATÓRIOS E ANÁLISES  [Ver Relatórios] ────►│               │
│  └──────────────────────────────────────────────────────┘               │
│                                                                           │
│  ┌──────────────────────────────────────────────────────┐               │
│  │ 📋 HISTÓRICO DE AVALIAÇÕES       [+ Nova Avaliação]  │               │
│  │                                                       │               │
│  │  ┌─────────────────────────────────────────────┐    │               │
│  │  │ 📅 02 de outubro de 2025                    │    │               │
│  │  │    Área irrigada: 15.5 ha                   │    │               │
│  │  │    CUD: 90.8% 🟢  CUC: 92.3% 🟢             │    │               │
│  │  └─────────────────────────────────────────────┘    │               │
│  │  ┌─────────────────────────────────────────────┐    │               │
│  │  │ 📅 10 de setembro de 2025                   │    │               │
│  │  │    Área irrigada: 15.5 ha                   │    │               │
│  │  │    CUD: 92.1% 🟢  CUC: 93.5% 🟢             │    │               │
│  │  └─────────────────────────────────────────────┘    │               │
│  └──────────────────────────────────────────────────────┘               │
└──────────┬────────────────┬─────────────────────────────────────────────┘
           │                │
           │                └─► [+ Nova Avaliação]
           │                    │
           │                    ▼
           │           ┌────────────────────────────────────────┐
           │           │  ✍️ NOVA AVALIAÇÃO                      │
           │           │  /propriedades/[id]/areas/[areaId]/    │
           │           │  nova-avaliacao/page.tsx ✨ NOVA       │
           │           │                                         │
           │           │  📝 Formulário:                         │
           │           │  ┌───────────────────────────────────┐ │
           │           │  │ Área Irrigada: [15.5] ha          │ │
           │           │  └───────────────────────────────────┘ │
           │           │                                         │
           │           │  📊 MEDIÇÕES:                           │
           │           │  ┌───────────────────────────────────┐ │
           │           │  │ Linha 1:                          │ │
           │           │  │ Volume: [150] L                   │ │
           │           │  │ Tempo: [60] min                   │ │
           │           │  │ Vazão: 150.00 L/h (automático)    │ │
           │           │  │                      [🗑️ Remover] │ │
           │           │  └───────────────────────────────────┘ │
           │           │  ┌───────────────────────────────────┐ │
           │           │  │ Linha 2:                          │ │
           │           │  │ Volume: [145] L                   │ │
           │           │  │ Tempo: [60] min                   │ │
           │           │  │ Vazão: 145.00 L/h (automático)    │ │
           │           │  │                      [🗑️ Remover] │ │
           │           │  └───────────────────────────────────┘ │
           │           │           [+ Adicionar Linha]          │
           │           │                                         │
           │           │  💬 Comentários: [textarea]             │
           │           │  📝 Recomendações: [textarea]           │
           │           │                                         │
           │           │      [Cancelar] [💾 Salvar Avaliação]  │
           │           └────────────────────────────────────────┘
           │
           └─► [Ver Relatórios]
               │
┌──────────────▼──────────────────────────────────────────────────────────┐
│                      📈 RELATÓRIOS COMPARATIVOS                          │
│       /propriedades/[id]/areas/[areaId]/relatorios/page.tsx ✨ NOVA     │
│                                                                           │
│  Relatórios - Área 1                                      [◄ Voltar]     │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 📊 CUD E CUC POR AVALIAÇÃO                                       │   │
│  │                                                                   │   │
│  │     100% ┤                                                        │   │
│  │          │     ██  ██                                            │   │
│  │      90% ┤ ██  ██  ██  ██                                        │   │
│  │          │ ██  ██  ██  ██                                        │   │
│  │      80% ┤ ██  ██  ██  ██                                        │   │
│  │          └─────────────────────                                  │   │
│  │            Jul  Ago  Set  Out                                    │   │
│  │            ■ CUD (%)  ■ CUC (%)                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 📋 RELATÓRIOS DETALHADOS                                         │   │
│  │                                                                   │   │
│  │  ┌────────────────────┐  ┌────────────────────┐                 │   │
│  │  │ 📅 02/10/2025      │  │ 📅 10/09/2025      │                 │   │
│  │  │ Clique para ver    │  │ Clique para ver    │                 │   │
│  │  │ CUD: 90.8%         │  │ CUD: 92.1%         │                 │   │
│  │  │ CUC: 92.3%         │  │ CUC: 93.5%         │                 │   │
│  │  └────────────────────┘  └────────────────────┘                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└───────────────────────────┬──────────────────────────────────────────────┘
                            │ CLIQUE EM AVALIAÇÃO
                            │
┌───────────────────────────▼──────────────────────────────────────────────┐
│                   🎨 RELATÓRIO DETALHADO ⭐ PRINCIPAL                    │
│  /propriedades/[id]/areas/[areaId]/relatorios/[avaliacaoId]/page.tsx    │
│                              ✨ NOVA                                      │
│                                                                           │
│  Relatório Detalhado - 02 de outubro de 2025           [◄ Voltar]       │
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Área Irrigada│  │ Volume Água  │  │ Tempo Irrig. │                  │
│  │   15.5 ha    │  │  12.500 L    │  │   180 min    │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│                                                                           │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │ 📊 CUD                         │  │ 📊 CUC                         │ │
│  │ Coef. Uniformidade Distribuição│  │ Coef. Uniformidade Christiansen│ │
│  │                                 │  │                                 │ │
│  │         90.8%                   │  │         92.3%                   │ │
│  │          Bom                    │  │          Bom                    │ │
│  │                                 │  │                                 │ │
│  │  Indicadores:                   │  │  Indicadores:                   │ │
│  │  🟢🟢🟢🟢🟢 (Bom ≥90%)          │  │  🟢🟢🟢🟢🟢 (Bom ≥90%)          │ │
│  │  ⬜⬜⬜⬜⬜ (Aceitável 80-90%)  │  │  ⬜⬜⬜⬜⬜ (Aceitável 80-90%)  │ │
│  │  ⬜⬜⬜⬜⬜ (Ruim <80%)          │  │  ⬜⬜⬜⬜⬜ (Ruim <80%)          │ │
│  └────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 🎮 VISUALIZAÇÃO 3D DA VAZÃO (INTERATIVO)                         │   │
│  │                                                                   │   │
│  │            Y (Vazão)                                             │   │
│  │              ↑                                                    │   │
│  │              │    ╔══╗                                           │   │
│  │              │    ║55║  ╔══╗                                     │   │
│  │              │    ║░░║  ║48║                                     │   │
│  │          ╔══╗│╔══╗╚══╝╔═╩══╗                                     │   │
│  │          ║60║│║52║    ║45 ║                                     │   │
│  │          ║░░║│║░░║    ║░  ║                                     │   │
│  │          ╚══╝│╚══╝    ╚═══╝                                     │   │
│  │     ──────────────────────────► X                                │   │
│  │            / Z                                                    │   │
│  │                                                                   │   │
│  │  🖱️ Use o mouse: Rotacionar | Scroll: Zoom | Direito: Pan      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 📊 ANÁLISES DE VAZÃO                                             │   │
│  │                                                                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │ 💧 Média │  │ ⬆️ Máxima│  │ ⬇️ Mínima│  │ 📐 Desvio│        │   │
│  │  │  50.25   │  │  65.30   │  │  45.80   │  │   4.52   │        │   │
│  │  │   L/h    │  │   L/h    │  │   L/h    │  │   L/h    │        │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │   │
│  │                                                                   │   │
│  │  📋 Interpretação:                                                │   │
│  │  • Vazão Média: Representa a vazão típica do sistema             │   │
│  │  • Desvio Padrão: Quanto menor, mais uniforme é a distribuição   │   │
│  │  • Variação (Max-Min): 19.50 L/h                                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Legenda de Cores

- 🟢 **Verde:** Bom (≥ 90%)
- 🟡 **Amarelo:** Aceitável (80-90%)
- 🔴 **Vermelho:** Ruim (< 80%)

---

## 📍 Rotas do Sistema

| Rota | Arquivo | Status |
|------|---------|--------|
| `/propriedades` | `page.tsx` | ✅ Existente |
| `/propriedades/[id]` | `page.tsx` | ✅ **NOVA** |
| `/propriedades/[id]/criar-area` | `page.tsx` | ✅ **NOVA** |
| `/propriedades/[id]/areas/[areaId]` | `page.tsx` | ✅ **NOVA** |
| `/propriedades/[id]/areas/[areaId]/nova-avaliacao` | `page.tsx` | ✅ **NOVA** |
| `/propriedades/[id]/areas/[areaId]/relatorios` | `page.tsx` | ✅ **NOVA** |
| `/propriedades/[id]/areas/[areaId]/relatorios/[avaliacaoId]` | `page.tsx` | ✅ **NOVA** |

---

## 🔄 Fluxo Simplificado

```
Dashboard
    ↓
Propriedades (lista)
    ↓ [clique]
Detalhes Propriedade
    ↓ [clique em área]
Detalhes Área
    ├─► Nova Avaliação → [salva] → volta
    └─► Ver Relatórios
            ↓ [clique em avaliação]
        Relatório Detalhado
            • CUD/CUC lado a lado
            • Gráfico 3D interativo
            • Análises de vazão
```

---

**Total de Páginas Novas:** 6  
**Total de Níveis de Navegação:** 5  
**Componentes Interativos:** Gráfico 2D + Gráfico 3D  
**Formulários Dinâmicos:** 2 (Criar Área + Nova Avaliação)
