# GlowTrack

GlowTrack é um companheiro diário de autocuidado dividido em **backend Node.js/Express + MongoDB** e **frontend Next.js (App Router)**. O objetivo é acompanhar skincare, maquilhagem, estilo de vida e progresso fotográfico numa experiência moderna e responsiva.

## Estrutura do monorepo
```
glowtrack/
  backend/        # API Express + MongoDB
  frontend/       # Aplicação Next.js
```

## 1. Pré-requisitos
1. Node.js 20+ instalado.
2. MongoDB local ou string Atlas.
3. npm disponível para instalar dependências.

## 2. Configurar variáveis de ambiente
Cria dois ficheiros `.env` (um em `backend/` e outro em `frontend/`).

### backend/.env
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/glowtrack
JWT_SECRET=uma_super_senha_segura
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 3. Instalar dependências
Executa os comandos pela ordem apresentada.

1. **Backend**
   ```bash
   cd backend
   npm install
   ```
2. **Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

## 4. Iniciar os servidores
### Backend
1. Garante que o MongoDB está ativo.
2. Dentro da pasta `backend/` corre:
   ```bash
   npm run dev
   ```
   O servidor Express ficará disponível em `http://localhost:5000/api` e expõe `/api/health` para testes rápidos.

### Frontend
1. Numa nova janela termina em `frontend/`.
2. Corre:
   ```bash
   npm run dev
   ```
3. Abre `http://localhost:3000` no navegador. O Next.js fará proxy das chamadas para o backend usando `NEXT_PUBLIC_API_URL`.

## 5. Funcionalidades principais
### Backend
- **Autenticação JWT**: registo, login e logout opcional; todas as rotas privadas usam `Bearer token` (expira em 7 dias).
- **Onboarding e diagnóstico**: guarda género, idade, tipo de pele, objetivos e questionário de 5 perguntas para classificar a pele.
- **Rotina de skincare**: gera passos manhã/noite, permite marcar como concluído e mantém histórico.
- **Makeup Match**: devolve base, corretivo, tons de blush/sombra/batom adaptados ao perfil.
- **Produtos**: catálogo dividido por categorias (limpeza, hidratação, tratamento, proteção e maquilhagem).
- **Lifestyle**: alimentação glow, hidratação com tracker diário, movimento sugerido e diário de humor.
- **Autoestima/diário**: regista humor do dia + frase motivacional aleatória.
- **Progresso**: check-ins, streak, conquistas, fotos de referência e estatísticas.

### Frontend
- Next.js App Router com layout protegido e autenticação via localStorage.
- Componentes reutilizáveis (`Card`, `Button`, `Input`, `Select`, `Badge`, `ProgressBar`).
- Secções dedicadas: atalhos rápidos, motivação diária, tracker de água, checklist da rotina.
- Páginas modernas e responsivas para onboarding, diagnóstico, rotina, makeup match, produtos, estilo de vida, bem-estar, progresso e perfil.
- UI clara (branco, bege e lilás suave), cartões com sombras e navegação mobile via bottom nav.

## 6. Testes automatizados (backend)
Foram adicionados testes com `node:test` + `supertest`:
- `GET /api/health` responde com sucesso.
- Fluxo de registo/login com criação real de utilizadora.
- `GET /api/routine` devolve rotinas manhã/noite após autenticação.

Para executar:
```bash
cd backend
npm test
```
Os testes usam `mongodb-memory-server`, não é necessário MongoDB real.

## 7. Fluxo sugerido para novos utilizadores
1. Registar em `/register`.
2. Preencher onboarding com género, idade, tipo de pele e objetivos.
3. Fazer diagnóstico e rever recomendações.
4. Explorar rotina automática, Makeup Match, produtos e estilo de vida.
5. Atualizar diário de bem-estar e fotos no separador Progresso.
6. Ajustar o perfil e idioma sempre que necessário.

Aproveita o GlowTrack e mantém o brilho todos os dias! ✨
