# CONTEXTO COMPLETO DO PROJETO - SGF (Sistema de Gestão de Filas)

## ARQUITETURA DO PROJETO

### Stack Tecnológica
- **Frontend**: React 18.2.0 + Vite 5.0
- **Roteamento**: React Router DOM v6 (rotas em português)
- **Autenticação**: JWT + bcryptjs (simulado em desenvolvimento)
- **Animações**: Framer Motion
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **HTTP Client**: Axios
- **Gerenciamento de Estado**: Context API (AuthContext, ThemeContext, CustomizationContext)

### Estrutura de Pastas
```
src/
├── components/
│   └── Navbar.jsx              # Barra de navegação global
├── context/
│   ├── AuthContext.jsx         # Autenticação e usuário logado
│   ├── ThemeContext.jsx        # Dark/Light mode
│   └── CustomizationContext.jsx # White label (logo + cores)
├── pages/
│   ├── Login.jsx               # /entrar
│   ├── Register.jsx            # /cadastro
│   ├── Dashboard.jsx           # /painel-controle (home após login)
│   ├── Reception.jsx           # /recepcao (cadastro de pacientes)
│   ├── Counter.jsx             # /guiche (atendimento)
│   ├── PublicPanel.jsx         # /painel (TV pública)
│   ├── AdminDashboard.jsx      # /administrador (métricas)
│   ├── Profile.jsx             # /perfil
│   └── Customization.jsx       # /personalizacao (white label)
├── services/
│   └── api.js                  # Axios configurado (backend futuro)
├── utils/
│   └── permissions.js          # Roles, permissões e UPAs
├── App.jsx                     # Rotas principais
├── main.jsx                    # Entry point
└── index.css                   # CSS global + variáveis de tema
```

---

## SISTEMA DE AUTENTICAÇÃO (MODO DESENVOLVIMENTO)

### Como Funciona
**CRÍTICO**: O sistema está em modo desenvolvimento. Qualquer senha funciona. O tipo de usuário é determinado pelo **padrão do email**.

### Padrões de Email e Roles

```javascript
// Super Admin (acesso total, todas UPAs)
super@email.com

// Admin Master (acesso total, todas UPAs)
diretora@email.com

// Admin UPA (acesso apenas à sua UPA)
admin-jangurussu@email.com
admin-edson-queiroz@email.com
admin-itaperi@email.com

// Recepcionista (cadastro de pacientes na sua UPA)
recepcao-jangurussu@email.com
recepcao-edson-queiroz@email.com
recepcao-itaperi@email.com

// Atendente (guichê na sua UPA)
atendente-jangurussu@email.com
atendente-edson-queiroz@email.com
atendente-itaperi@email.com
```

### Extração de UPA do Email
```javascript
// Exemplo: "admin-edson-queiroz@email.com"
// 1. Split por '@' -> pega parte antes
// 2. Split por '-' -> ["admin", "edson", "queiroz"]
// 3. slice(1).join('-') -> "edson-queiroz"
```

**IMPORTANTE**: UPAs com hífen (edson-queiroz) precisam do `.join('-')` para reconstruir o slug completo.

---

## SISTEMA DE PERMISSÕES

### Hierarquia de Roles (permissions.js)

```javascript
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN_MASTER: 'admin_master',
  ADMIN_UPA: 'admin_upa',
  RECEPCIONISTA: 'recepcionista',
  ATENDENTE: 'atendente'
};

export const PERMISSIONS = {
  super_admin: {
    label: 'Super Administrador',
    canAccessAllUpas: true,
    canManageUsers: true,
    canManageUpas: true,
    canViewDashboard: true,
    canAccessRecepcao: true,
    canAccessGuiche: true,
    canAccessAdmin: true,
    canAccessSuperAdmin: true,
    canCustomize: true
  },
  admin_master: {
    label: 'Administrador Master',
    canAccessAllUpas: true,
    canManageUsers: true,
    canViewDashboard: true,
    canAccessRecepcao: true,
    canAccessGuiche: true,
    canAccessAdmin: true,
    canCustomize: true
  },
  admin_upa: {
    label: 'Administrador UPA',
    canAccessAllUpas: false,
    canManageUsers: true,
    canViewDashboard: true,
    canAccessRecepcao: true,
    canAccessGuiche: true,
    canAccessAdmin: true,
    canCustomize: true
  },
  recepcionista: {
    label: 'Recepcionista',
    canAccessAllUpas: false,
    canAccessRecepcao: true
  },
  atendente: {
    label: 'Atendente',
    canAccessAllUpas: false,
    canAccessGuiche: true
  }
};
```

### UPAs Cadastradas

```javascript
export const UPAS = [
  { id: 'jangurussu', name: 'UPA Jangurussu', slug: 'jangurussu' },
  { id: 'edson-queiroz', name: 'UPA Edson Queiroz', slug: 'edson-queiroz' },
  { id: 'itaperi', name: 'UPA Itaperi', slug: 'itaperi' }
];
```

### Funções Úteis

```javascript
// Verificar se usuário tem permissão
hasPermission(user, 'canAccessRecepcao')

// Pegar UPAs que usuário pode acessar
getAccessibleUpas(user) // Retorna array de UPAs

// Buscar UPA por slug
getUpaBySlug('edson-queiroz')
```

---

## ROTAS E PROTEÇÃO

### Rotas Públicas
- `/entrar` - Login
- `/cadastro` - Registro
- `/painel` - Painel público (TV)

### Rotas Protegidas (App.jsx)

```javascript
// Dashboard - Todos usuários autenticados
<Route path="/painel-controle" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

// Recepção - Precisa de canAccessRecepcao
<Route path="/recepcao" element={<ProtectedRoute requiredPermission="canAccessRecepcao"><Reception /></ProtectedRoute>} />

// Guichê - Precisa de canAccessGuiche
<Route path="/guiche" element={<ProtectedRoute requiredPermission="canAccessGuiche"><Counter /></ProtectedRoute>} />

// Admin - Precisa de canAccessAdmin
<Route path="/administrador" element={<ProtectedRoute requiredPermission="canAccessAdmin"><AdminDashboard /></ProtectedRoute>} />

// Personalização - Precisa de canCustomize
<Route path="/personalizacao" element={<ProtectedRoute requiredPermission="canCustomize"><Customization /></ProtectedRoute>} />

// Perfil - Todos usuários autenticados
<Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
```

---

## SISTEMA DE TEMAS (Dark/Light Mode)

### ThemeContext.jsx
- Armazena tema em `localStorage` com chave `theme`
- Aplica atributo `data-theme="dark"` no `<html>`
- Função `toggleTheme()` para alternar

### Variáveis CSS (index.css)

```css
:root {
  --primary: #6366f1;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --border: #e2e8f0;
  /* ... */
}

[data-theme="dark"] {
  --primary: #818cf8;
  --bg-primary: #1e293b;
  --bg-secondary: #0f172a;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border: #334155;
  /* ... */
}
```

**REGRA**: Todas as páginas usam variáveis CSS, nunca cores hardcoded.

---

## SISTEMA WHITE LABEL (Customização)

### CustomizationContext.jsx

**Armazenamento**: `localStorage` com chave `customization_{upa_id}`

**Estrutura**:
```javascript
{
  logo: null, // Base64 da imagem ou null
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  accentColor: '#10b981'
}
```

**Aplicação**: Injeta CSS variables dinamicamente no `<html>`:
```javascript
document.documentElement.style.setProperty('--primary', config.primaryColor);
document.documentElement.style.setProperty('--secondary', config.secondaryColor);
document.documentElement.style.setProperty('--accent', config.accentColor);
```

**Isolamento**: Cada UPA tem sua própria customização. Admin de UPA A não afeta UPA B.

---

## PÁGINAS PRINCIPAIS

### 1. Dashboard.jsx (/painel-controle)
- **Função**: Home após login, cards de acesso rápido
- **Cards visíveis por role**:
  - Recepção: `canAccessRecepcao`
  - Guichê: `canAccessGuiche`
  - Painel Público: Todos
  - Administrador: `canAccessAdmin`
  - Personalização: `canCustomize`
- **Exibe**: Nome do usuário, UPA (se tiver), cards com ícones

### 2. Reception.jsx (/recepcao)
- **Função**: Cadastro de pacientes na fila
- **Campos**: Nome, Tipo (Padrão/Prioritário/Urgência), Unidade
- **Isolamento UPA**: 
  - Admin pode escolher UPA
  - Recepcionista vê apenas sua UPA (read-only)
- **Feedback**: Mensagem de sucesso verde, lista de últimos 5 pacientes
- **Mock**: Simula cadastro com `Date.now()` como ID

### 3. Counter.jsx (/guiche)
- **Função**: Atendente chama e atende pacientes
- **Estados**: 
  - Aguardando: Botão "Chamar Próximo"
  - Atendendo: Mostra nome, tipo, botões Finalizar/Cancelar/Repetir
- **Guichê**: Fixo como 1 (pode ser dinâmico no futuro)
- **Mock**: Simula chamada de fila

### 4. PublicPanel.jsx (/painel)
- **Função**: TV pública mostrando chamadas em tempo real
- **Layout**: 
  - Header: Logo UPA, relógio, botão tema
  - Main: Chamada atual (nome grande + guichê)
  - Sidebar: Histórico de últimas 6 chamadas
- **Animação**: Framer Motion com escala e fade
- **TTS**: Usa `speechSynthesis` para anunciar paciente
- **Mock**: Botão "Simular Chamada" (remover em produção)

### 5. AdminDashboard.jsx (/administrador)
- **Função**: Métricas e estatísticas
- **Cards**: Total, Finalizados, Cancelados, Aguardando
- **Gráficos**: 
  - Linha: Atendimentos por hora
  - Pizza: Distribuição por UPA
  - Barra: Atendimentos por guichê
- **Filtro UPA**: Admin Master/Super vê dropdown, Admin UPA vê só sua UPA
- **Mock**: Dados estáticos para demonstração

### 6. Profile.jsx (/perfil)
- **Função**: Informações do usuário
- **Seções**:
  - Avatar com inicial do nome
  - Dados pessoais (nome, email, UPA)
  - Lista de permissões (checkmarks verdes/vermelhos)
  - Botões: Editar Perfil, Alterar Senha (em desenvolvimento)

### 7. Customization.jsx (/personalizacao)
- **Função**: White label para admins
- **Seções**:
  - Upload de logo (aceita PNG/JPG/SVG)
  - Color pickers: Primária, Secundária, Destaque
  - Preview de botões com cores aplicadas
  - Botões: Salvar, Restaurar Padrão

---

## COMPONENTES GLOBAIS

### Navbar.jsx
- **Props**: `title`, `subtitle`
- **Elementos**:
  - Logo/Título à esquerda
  - Botão Home (volta ao dashboard)
  - Toggle tema (sol/lua)
  - Avatar com dropdown (Perfil, Logout)
- **Estilo**: Sticky top, background com blur

---

## FLUXO DE DADOS (MOCK vs PRODUÇÃO)

### Modo Atual (Desenvolvimento)
- Todos os dados são **mockados** (simulados)
- Não há backend real
- `api.js` está configurado mas não é usado
- Estados locais com `useState`

### Preparação para Backend
```javascript
// Exemplo em Reception.jsx
try {
  // MODO DESENVOLVIMENTO - Simular cadastro
  const mockAtendimento = { /* ... */ };
  
  /* COM BACKEND REAL:
  const res = await api.post('/atendimentos', {
    unidade,
    nome_paciente: nome,
    tipo_atendimento: tipo
  });
  setLastAtendimento(res.data);
  */
} catch (error) {
  console.error('Erro:', error);
}
```

**WebSocket**: Comentado em todos os lugares, será implementado para chamadas em tempo real.

---

## ESTILOS E DESIGN SYSTEM

### Padrões de CSS
- **Containers**: `.{page}-container` com padding 2-3rem
- **Cards**: `.card` com background, border-radius, shadow
- **Botões**: 
  - `.btn.btn-primary` - Ação principal
  - `.btn.btn-secondary` - Ação secundária
  - `.btn.btn-success` - Confirmação
  - `.btn.btn-danger` - Cancelamento
- **Badges**: `.badge-padrão`, `.badge-prioritário`, `.badge-urgência`

### Responsividade
- Desktop first
- Breakpoints: 1200px, 768px
- Grid layouts com `grid-template-columns`

### Animações
- Framer Motion: `initial`, `animate`, `exit`
- Transições CSS: `transition: all 0.3s ease`
- Loading spinners: `.loading-spinner`

---

## DADOS IMPORTANTES

### Tipos de Atendimento
```javascript
['Padrão', 'Prioritário', 'Urgência']
```

### Status de Atendimento
```javascript
['aguardando', 'chamado', 'em_atendimento', 'finalizado', 'cancelado']
```

### Estrutura de Atendimento (Mock)
```javascript
{
  id: Date.now(),
  nome_paciente: 'João Silva',
  tipo_atendimento: 'Padrão',
  unidade: 'UPA Jangurussu',
  status: 'aguardando',
  hora_criacao: new Date().toISOString(),
  guiche: 1
}
```

---

## PROBLEMAS CONHECIDOS E SOLUÇÕES

### 1. UPA com Hífen
**Problema**: `edson-queiroz` quebrava ao fazer split
**Solução**: `email.split('-').slice(1).join('-')`

### 2. Nome do Usuário
**Comportamento**: Mostra apenas primeiro nome (ex: "Admin" não "Admin Master")
**Motivo**: Simplificação da UI

### 3. Botão Voltar Sobrescrevendo
**Problema**: No PublicPanel, botão cobria o título
**Solução**: Posicionamento absoluto + centralização do brand

### 4. Tema não Persistindo
**Solução**: `localStorage.getItem('theme')` no mount do ThemeContext

---

## COMANDOS ÚTEIS

```bash
# Instalar dependências
npm install

# Rodar desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## PRÓXIMOS PASSOS (Backend)

1. **API REST**:
   - POST `/auth/login` - Autenticação real
   - POST `/auth/register` - Cadastro
   - GET/POST `/atendimentos` - CRUD de atendimentos
   - GET `/stats` - Estatísticas

2. **WebSocket**:
   - Evento `nova_chamada` - Atualizar painel público
   - Evento `atendimento_finalizado` - Atualizar fila

3. **Upload de Arquivos**:
   - Endpoint para upload de logo
   - Armazenamento em S3 ou local

4. **Banco de Dados**:
   - Tabelas: users, upas, atendimentos, customizations
   - Relacionamentos: user -> upa, atendimento -> upa

---

## DICAS PARA LLM

1. **Sempre verificar permissões** antes de mostrar funcionalidades
2. **Usar variáveis CSS** para cores, nunca hardcode
3. **Manter isolamento de UPA** em todas as operações
4. **Comentar código mock** com `/* COM BACKEND REAL: */`
5. **Testar com diferentes roles** (usar emails de teste)
6. **Respeitar hierarquia de pastas** ao criar novos arquivos
7. **Usar Framer Motion** para animações importantes
8. **Sempre adicionar loading states** em operações assíncronas
9. **Validar inputs** antes de enviar (trim, required, etc)
10. **Manter consistência** de nomenclatura (português nas rotas, inglês no código)

---

## CONTEXTO DE NEGÓCIO

**O que é**: Sistema de gestão de filas para UPAs (Unidades de Pronto Atendimento) de saúde pública.

**Objetivo**: Organizar fluxo de pacientes, reduzir tempo de espera, melhorar experiência.

**Multi-tenancy**: Cada UPA é isolada, com seus próprios dados, usuários e customização visual.

**Usuários finais**:
- Recepcionistas cadastram pacientes
- Atendentes chamam e atendem
- Pacientes veem painel público
- Admins monitoram métricas

**Diferenciais**:
- White label (cada UPA com sua marca)
- Priorização automática (Urgência > Prioritário > Padrão)
- Painel público com TTS (anúncio por voz)
- Dark mode para conforto visual
