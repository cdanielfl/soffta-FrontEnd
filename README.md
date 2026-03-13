# SGF - Sistema de Gestão de Filas

Sistema web para gerenciamento de filas de atendimento em UPAs (Unidades de Pronto Atendimento).

## 🚀 Tecnologias

- React 18.2.0 + Vite
- React Router DOM v6
- Framer Motion (animações)
- Recharts (gráficos)
- Lucide React (ícones)
- Axios (HTTP client)

## 📦 Instalação

```bash
npm install
npm run dev
```

Acesse: `http://localhost:5173`

## 🔐 Login de Desenvolvimento

O sistema está em modo desenvolvimento. Use qualquer senha com os emails abaixo:

### Super Admin (todas UPAs)
- `super@email.com`

### Admin Master (todas UPAs)
- `diretora@email.com`

### Admin UPA (apenas sua UPA)
- `admin-jangurussu@email.com`
- `admin-edson-queiroz@email.com`
- `admin-itaperi@email.com`

### Recepcionista (cadastro de pacientes)
- `recepcao-jangurussu@email.com`
- `recepcao-edson-queiroz@email.com`
- `recepcao-itaperi@email.com`

### Atendente (guichê)
- `atendente-jangurussu@email.com`
- `atendente-edson-queiroz@email.com`
- `atendente-itaperi@email.com`

## 📱 Funcionalidades

### ✅ Implementado
- [x] Sistema de autenticação (mock)
- [x] Multi-tenancy (isolamento por UPA)
- [x] Controle de permissões hierárquico
- [x] Cadastro de pacientes (Recepção)
- [x] Chamada de pacientes (Guichê)
- [x] Painel público com TTS
- [x] Dashboard administrativo com métricas
- [x] Dark/Light mode
- [x] White label (logo + cores personalizadas)
- [x] Perfil de usuário
- [x] Rotas em português

### 🔄 Pendente (Backend)
- [ ] API REST real
- [ ] WebSocket para chamadas em tempo real
- [ ] Banco de dados
- [ ] Upload de arquivos
- [ ] Autenticação JWT real

## 🗂️ Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── context/          # Context API (Auth, Theme, Customization)
├── pages/            # Páginas da aplicação
├── services/         # API client (Axios)
├── utils/            # Funções utilitárias (permissions)
├── App.jsx           # Rotas principais
└── main.jsx          # Entry point
```

## 🎨 Rotas

- `/entrar` - Login
- `/cadastro` - Registro
- `/painel-controle` - Dashboard (home)
- `/recepcao` - Cadastro de pacientes
- `/guiche` - Atendimento
- `/painel` - Painel público (TV)
- `/administrador` - Métricas
- `/perfil` - Perfil do usuário
- `/personalizacao` - White label

## 🔒 Sistema de Permissões

| Role | Recepção | Guichê | Admin | Personalização | Todas UPAs |
|------|----------|--------|-------|----------------|------------|
| Super Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin Master | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin UPA | ✅ | ✅ | ✅ | ✅ | ❌ |
| Recepcionista | ✅ | ❌ | ❌ | ❌ | ❌ |
| Atendente | ❌ | ✅ | ❌ | ❌ | ❌ |

## 🎯 UPAs Cadastradas

1. UPA Jangurussu (`jangurussu`)
2. UPA Edson Queiroz (`edson-queiroz`)
3. UPA Itaperi (`itaperi`)

## 📝 Contexto Completo

Para LLMs e desenvolvedores, veja o arquivo `CONTEXT.md` com documentação técnica detalhada.

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📄 Licença

Projeto desenvolvido para Front-Softa.
