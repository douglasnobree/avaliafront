# Formulário Completo de Cadastro de Área

## O que foi implementado?

Criei um formulário completo em **duas etapas** para cadastrar áreas de irrigação, incluindo todos os campos técnicos exigidos pelos models Prisma `Setor_Hidraulico` e `Pivo_Central`.

## 🎯 Estrutura do Formulário

### **Etapa 1: Seleção do Tipo de Sistema**
O usuário escolhe entre dois tipos de irrigação:

1. **🌊 Irrigação Localizada (Setor Hidráulico)**
   - Sistema com gotejadores ou microaspersores
   - Ideal para culturas em linha, pomares e hortaliças

2. **🎡 Pivô Central**
   - Sistema mecanizado com torres móveis
   - Ideal para grandes áreas de grãos e pastagens

### **Etapa 2: Formulário de Dados Técnicos**
Após escolher o tipo, o usuário preenche os campos específicos organizados em cards temáticos.

---

## 📋 Campos do Formulário

### **Para SETOR HIDRÁULICO (Irrigação Localizada)**

#### 1. Informações Básicas
- **Identificação do Sistema** (ex: "Setor 1 - Bananal")
- **Área em hectares**

#### 2. Emissores
- Tipo de Emissor (Gotejador / Microaspersor)
- Fabricante (ex: Netafim, Naandanjain)
- Modelo
- Vazão Nominal (L/h)
- Número de Emissores

#### 3. Pressões e Espaçamentos
- Pressão de Trabalho (mca)
- Pressão Recomendada (mca)
- Pressão de Entrada (mca)
- Distância entre Emissores (m)
- Distância entre Linhas Laterais (m)

#### 4. Filtragem e Controle
- Tipo de Filtro (Tela, Disco, Areia)
- Malha/Grau de Filtragem (ex: 130 mesh, 120 micras)
- Tipo de Válvula (Manual, Elétrica, Hidráulica)
- Tipo de Energia (Elétrica, Fotovoltaica, Combustível)

#### 5. Manutenção e Observações
- Frequência de Manutenção
- Data da Última Manutenção
- Condições Gerais do Setor (Textarea livre)

---

### **Para PIVÔ CENTRAL**

#### 1. Informações Básicas
- **Identificação do Sistema** (ex: "Pivô 01 - Milho Leste")
- **Área em hectares**

#### 2. Estrutura do Pivô
- Fabricante (ex: Valley, Lindsay, Bauer)
- Modelo
- Número de Torres Móveis
- Comprimento Total (m)

#### 3. Sistema de Emissão
- Tipo de Emissores (Sprays/Sprinklers / LEPA/Bocais)
- Tipo de Bocal (Spray, Rotativo, LEPA)
- Pressão dos Bocais (mca)

#### 4. Operação
- Tipo de Energia (Elétrica trifásica, Diesel)
- Potência do Motor (cv)
- Vazão de Operação (m³/h)
- Tipo de Controle (Manual, Painel Digital, GPS)
- Possui Fertirrigação? (Sim/Não)
- Fonte Hídrica (Poço profundo, Reservatório)
- Tempo Médio de Funcionamento (h/dia)
- Velocidade de Deslocamento (%)

#### 5. Manutenção
- Frequência de Manutenção
- Data da Última Manutenção
- Data da Última Avaliação
- Problemas Observados (Textarea opcional)

---

## 🔧 Estrutura do Payload da API

Quando o formulário é submetido, ele envia um payload estruturado para o endpoint `POST /areas`:

### Para Setor Hidráulico:
```json
{
  "area": {
    "identificacao": "Setor 1 - Bananal",
    "area_ha": 10.5,
    "propriedade_id": "uuid"
  },
  "setor_hidraulico": {
    "fabricante": "Netafim",
    "modelo": "UniRam",
    "vazao_nominal": 2.5,
    "pressao_trabalho": 10,
    "pressao_recomendada": 12,
    "dist_emissores": 0.5,
    "dist_laterais": 1.5,
    "filtro_tipo": "Tela",
    "malha_filtro": "130 mesh",
    "pressao_entrada": 15,
    "valvula_tipo": "Elétrica",
    "energia_tipo": "Elétrica",
    "condicoes_gerais": "Sistema em boas condições...",
    "num_emissores": 1000,
    "freq_manutencao": "Semanal",
    "data_ultima_manutencao": "2025-09-15T00:00:00.000Z",
    "emissor_type": "GOTEJAMENTO",
    "tipo_setor": "SETOR_HIDRAULICO"
  }
}
```

### Para Pivô Central:
```json
{
  "area": {
    "identificacao": "Pivô 01 - Milho Leste",
    "area_ha": 50.0,
    "propriedade_id": "uuid"
  },
  "pivo_central": {
    "num_torres": 5,
    "comprimento": 380,
    "fabricante": "Valley",
    "modelo": "8000",
    "emissor_type": "MICROMICROASPERSOR",
    "energia_tipo": "Elétrica trifásica",
    "potencia_motor": 125,
    "vazao_operacao": 150,
    "controle_tipo": "Painel Digital",
    "fertirrigacao": true,
    "fonte_hidrica": "Poço profundo",
    "tempo_funcionamento": 18,
    "velocidade": 100,
    "bocal_tipo": "Spray",
    "pressao_bocal": 20,
    "data_ultima_manutencao": "2025-08-01T00:00:00.000Z",
    "freq_manutencao": "Mensal",
    "problemas_observados": "Nenhum problema identificado",
    "data_ultima_avaliacoes": "2025-09-01T00:00:00.000Z"
  }
}
```

---

## 🎨 Componentes Usados

- **shadcn/ui Components:**
  - `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
  - `Button` (com variantes outline/default)
  - `Input` (com tipos number, text, date)
  - `Label`
  - `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
  - `Textarea`

- **React Hook Form:**
  - `useForm` para gerenciamento de estado
  - `Controller` para componentes controlados (Select)
  - Validação com Zod schemas

- **Lucide Icons:**
  - `ChevronLeft`, `ChevronRight`, `Loader2`

---

## 🔍 Validação com Zod

Utilizei **discriminated unions** do Zod para validar os dois tipos de formulário:

```typescript
const createAreaSchema = z.discriminatedUnion('tipo_sistema', [
  setorHidraulicoSchema,
  pivoCentralSchema,
]);
```

Cada schema valida os campos específicos do seu tipo de sistema, garantindo que todos os campos obrigatórios sejam preenchidos antes do submit.

---

## 🚀 Como Testar

1. **Acesse:** `http://localhost:3002`
2. **Faça login** na aplicação
3. **Navegue até:** Propriedades → [Escolha uma propriedade] → **Criar Nova Área**
4. **Escolha o tipo de sistema:**
   - Clique em "Irrigação Localizada" ou "Pivô Central"
5. **Preencha todos os campos obrigatórios** (marcados com *)
6. **Clique em "Criar Área"**

### Botões de Navegação:
- **Etapa 1:** Botão "Voltar" retorna para a página da propriedade
- **Etapa 2:** 
  - Botão "Voltar" retorna para a escolha do tipo
  - Botão "Criar Área" submete o formulário

---

## ⚠️ Próximos Passos - Backend

Você precisará implementar o endpoint no backend NestJS:

### Endpoint: `POST /areas`

**Controller:** `hydraulic-sector.controller.ts` ou criar um novo `areas.controller.ts`

**Lógica esperada:**
1. Receber o payload com `area` + (`setor_hidraulico` OU `pivo_central`)
2. Criar a `Unidade_avaliada` primeiro
3. Criar o `Setor_Hidraulico` ou `Pivo_Central` associado
4. Vincular o `userId` da sessão atual
5. Retornar sucesso com ID da área criada

**Exemplo de implementação:**
```typescript
@Post('areas')
async createArea(@Body() dto: CreateAreaDto, @Session() session) {
  const userId = session.user.id;
  
  // Criar a área
  const area = await this.prisma.unidade_avaliada.create({
    data: {
      identificacao: dto.area.identificacao,
      area_ha: dto.area.area_ha,
      propriedade_id: dto.area.propriedade_id,
    }
  });
  
  // Se for Setor Hidráulico
  if (dto.setor_hidraulico) {
    await this.prisma.setor_Hidraulico.create({
      data: {
        ...dto.setor_hidraulico,
        userId,
      }
    });
  }
  
  // Se for Pivô Central
  if (dto.pivo_central) {
    await this.prisma.pivo_Central.create({
      data: {
        ...dto.pivo_central,
      }
    });
  }
  
  return { success: true, areaId: area.id };
}
```

---

## 📦 Dependências Instaladas

- `@radix-ui/react-select` - Para os componentes Select dropdown

---

## ✅ Checklist de Validação

- [x] Formulário em duas etapas funcionando
- [x] Todos os campos do Prisma incluídos
- [x] Validação Zod implementada
- [x] UI responsiva com cards organizados
- [x] Navegação entre etapas
- [x] Type safety com TypeScript
- [x] Conversão de tipos (string → number, date → ISO)
- [x] Payload estruturado corretamente
- [ ] Endpoint backend implementado (próximo passo)
- [ ] Teste end-to-end com dados reais

---

## 📝 Notas Técnicas

1. **Discriminated Union:** Usei `z.discriminatedUnion` para criar schemas diferentes baseados no campo `tipo_sistema`

2. **Type Assertion:** Precisei usar `as any` nos errors do React Hook Form para evitar problemas de type narrowing do TypeScript com discriminated unions

3. **Conversão de Dados:** Todos os campos numéricos são convertidos de string para number antes de enviar (parseFloat, parseInt)

4. **Datas:** As datas são convertidas para ISO string usando `new Date().toISOString()`

5. **Campos Opcionais:** `problemas_observados` no Pivô Central é o único campo opcional

---

Agora você pode testar criando uma área completa! O formulário está pronto e validado. 🎉
