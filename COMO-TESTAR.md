# 🧪 Como Testar as Novas Telas

## 🚀 Iniciando o Projeto

### 1. Backend
```powershell
cd c:\AVAlia\avalia-irriga-backend
npm run start:dev
```

### 2. Frontend
```powershell
cd c:\AVAlia\avaliafront
npm run dev
```

Acesse: `http://localhost:3000`

---

## 📋 Roteiro de Teste

### Passo 1: Login/Criação de Conta
1. Acesse `http://localhost:3000`
2. Faça login ou crie uma conta
3. Crie uma organização (se for primeiro acesso)

### Passo 2: Criar Propriedade
1. No dashboard, clique em "Nova Propriedade" ou vá em "Propriedades"
2. Preencha o formulário com dados da propriedade
3. Clique em "Criar Propriedade"

### Passo 3: Ver Detalhes da Propriedade ✨ **NOVA TELA**
1. Na lista de propriedades, **clique em uma propriedade**
2. Você verá:
   - Informações do proprietário
   - Dados da propriedade
   - Seção "Áreas da Fazenda" (vazia inicialmente)

### Passo 4: Criar Área ✨ **NOVA TELA**
1. Clique em "Nova Área"
2. Preencha:
   - Nome da área (ex: "Talhão A", "Área 1")
   - Área em hectares (ex: 15.5)
3. Clique em "Criar Área"

### Passo 5: Ver Detalhes da Área ✨ **NOVA TELA**
1. **Clique na área criada**
2. Você verá:
   - Informações da área
   - Mensagem "Nenhuma avaliação realizada"
   - Botão "Nova Avaliação"

### Passo 6: Criar Nova Avaliação ✨ **NOVA TELA**
1. Clique em "Nova Avaliação"
2. Preencha:
   - **Área irrigada**: 15.5
   - **Primeira medição:**
     - Volume: 150 (L)
     - Tempo: 60 (min)
     - Vazão: *calculada automaticamente* → 150 L/h
   
3. Clique em "Adicionar Linha" e adicione mais medições:
   - **Linha 2:** Volume: 145, Tempo: 60 → Vazão: 145 L/h
   - **Linha 3:** Volume: 155, Tempo: 60 → Vazão: 155 L/h
   - **Linha 4:** Volume: 148, Tempo: 60 → Vazão: 148 L/h

4. Adicione comentários:
   - **Comentários:** "Sistema apresentando boa uniformidade."
   - **Recomendações:** "Realizar manutenção preventiva nos próximos 30 dias."

5. Clique em "Salvar Avaliação"

### Passo 7: Ver Área com Avaliações ✨ **ATUALIZADO**
1. Você voltará para a página da área
2. Agora verá:
   - **Cards superiores** com última avaliação (CUD e CUC)
   - **Card destacado** "Ver Relatórios e Análises"
   - **Lista de avaliações** com data e resultados

### Passo 8: Ver Relatórios Comparativos ✨ **NOVA TELA**
1. Clique em "Ver Relatórios"
2. Você verá:
   - **Gráfico de barras** com CUD e CUC (mock com 4 avaliações)
   - **Cards de relatórios** para clicar

### Passo 9: Ver Relatório Detalhado ✨ **NOVA TELA - DESTAQUE!**
1. **Clique em uma avaliação** da lista
2. Você verá a tela mais completa:

   **a) Informações Gerais (3 cards)**
   - Área irrigada
   - Volume de água
   - Tempo de irrigação

   **b) CUD e CUC (lado a lado)** 📊
   - Cards grandes e coloridos
   - Porcentagem em destaque
   - Status: "Bom", "Aceitável" ou "Ruim"
   - Indicadores de cores (barrinhas)
   - Legenda explicativa

   **c) Gráfico 3D Interativo** 🎮
   - Visualização 3D da distribuição de vazão
   - Use o mouse para:
     - **Rotacionar:** Clique e arraste
     - **Zoom:** Scroll do mouse
     - **Pan:** Botão direito e arraste
   - Barras coloridas (vermelho = baixo, verde = alto)
   - Valores de vazão flutuando sobre as barras

   **d) Análises de Vazão** 📈
   - 4 cards coloridos:
     - Vazão Média (azul)
     - Vazão Máxima (verde)
     - Vazão Mínima (vermelho)
     - Desvio Padrão (roxo)
   - Seção de interpretação

---

## 🎯 Pontos de Atenção para Testar

### Validações
- [ ] Tente criar área sem nome → erro
- [ ] Tente criar área sem hectares → erro
- [ ] Tente criar avaliação sem medições → erro
- [ ] Tente salvar medição sem volume → erro
- [ ] Tente salvar medição sem tempo → erro

### Cálculos Automáticos
- [ ] Vazão é calculada ao sair do campo "Tempo"
- [ ] Fórmula: (Volume / Tempo) × 60 = Vazão em L/h
- [ ] Exemplo: 150L ÷ 60min × 60 = 150 L/h

### Navegação
- [ ] Botão "Voltar" funciona em todas as páginas
- [ ] Cards são clicáveis
- [ ] Links do header funcionam

### Visual
- [ ] Cores mudam baseadas em CUD/CUC:
  - Verde: ≥ 90%
  - Amarelo: 80-90%
  - Vermelho: < 80%
- [ ] Gráfico 3D é interativo
- [ ] Loading states aparecem

---

## 🐛 Problemas Conhecidos (Esperados)

### 1. Dados Mock
- Algumas telas usam dados de exemplo (mock)
- Os relatórios mostram 4 avaliações fictícias
- Isso é normal até conectar com o backend

### 2. Endpoints Faltando
Estes endpoints ainda não existem no backend:
- `POST /areas`
- `GET /areas/:id`
- `GET /property/:id/areas`
- `POST /avaliacoes`
- `GET /avaliacoes/:id`
- `GET /areas/:id/avaliacoes`

**Erro esperado:** 404 ao tentar salvar áreas/avaliações

### 3. Performance do Gráfico 3D
- Pode ser lento em computadores antigos
- É normal o gráfico levar 1-2 segundos para carregar

---

## 📸 Capturas de Tela Recomendadas

Tire prints destas telas para documentação:

1. ✅ Detalhes da Propriedade (com e sem áreas)
2. ✅ Criar Nova Área (formulário)
3. ✅ Detalhes da Área (sem avaliações)
4. ✅ Detalhes da Área (com avaliações)
5. ✅ Formulário de Nova Avaliação
6. ✅ Relatórios Comparativos (gráfico de barras)
7. ✅ Relatório Detalhado (destaque para CUD/CUC e gráfico 3D)

---

## 🔧 Troubleshooting

### Gráfico 3D não aparece
```bash
# Reinstale as dependências 3D
cd c:\AVAlia\avaliafront
npm install three @react-three/fiber @react-three/drei --force
```

### Gráfico de barras não aparece
```bash
# Reinstale recharts
cd c:\AVAlia\avaliafront
npm install recharts --force
```

### Erro de compilação TypeScript
```bash
# Limpe o cache e reinstale
cd c:\AVAlia\avaliafront
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

### Port já em uso
```powershell
# Matar processo na porta 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Ou use outra porta
$env:PORT=3001; npm run dev
```

---

## ✅ Checklist Final

Antes de marcar como concluído, teste:

- [ ] Login/Registro funciona
- [ ] Criar propriedade funciona
- [ ] Ver detalhes da propriedade
- [ ] Criar área (mock ou real)
- [ ] Ver detalhes da área
- [ ] Formulário de nova avaliação
- [ ] Cálculo automático de vazão
- [ ] Adicionar/remover linhas de medição
- [ ] Navegação entre todas as telas
- [ ] Gráfico de barras nos relatórios
- [ ] Gráfico 3D no relatório detalhado
- [ ] Interação com gráfico 3D (rotação, zoom)
- [ ] Cards de análise de vazão
- [ ] Cores dinâmicas baseadas em CUD/CUC
- [ ] Responsive design (teste no mobile)

---

## 🎉 Resultado Esperado

Ao final dos testes, você deve conseguir:

1. ✅ Navegar de Propriedade → Área → Avaliação
2. ✅ Ver gráficos comparativos
3. ✅ Ver relatório detalhado com:
   - CUD e CUC coloridos
   - Gráfico 3D interativo de vazão
   - Análises estatísticas
4. ✅ Criar novas avaliações com múltiplas medições
5. ✅ Ver histórico completo

---

**Dica:** Comece testando com dados mock (já configurados) e depois, quando o backend estiver pronto, teste com dados reais! 🚀
