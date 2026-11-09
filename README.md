# SmartLearn Frontend (SmartMach LMS)

Frontend do MVP da plataforma de cursos e certificações da SmartMach para operadores de Vending Machines.

---

## 🛠️ Tecnologias

- [Next.js 15](https://nextjs.org/) (App Router, Standalone build)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (Ícones)
- [Docker](https://www.docker.com/)

---

## 🚀 Rodando Localmente

### Pré-requisitos
- Node.js 20+
- npm

### Instalação e Execução
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🐳 Executando com Docker

### 1. Build da Imagem
```bash
docker build -t smartlearn-frontend .
```

### 2. Rodar o Container
```bash
docker run -p 3000:3000 smartlearn-frontend
```

Acesse em [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deploy no Railway

O projeto já está preparado com `output: "standalone"` no [`next.config.ts`](./next.config.ts) e um [`Dockerfile`](./Dockerfile) multi-stage otimizado.

### Passo a passo no painel do Railway:

1. **Repositório Git**:
   Faça o commit e push do projeto para seu repositório no GitHub:
   ```bash
   git add .
   git commit -m "feat: setup project for production and railway deployment"
   git push origin main
   ```

2. **Criar Projeto no Railway**:
   - Acesse [Railway](https://railway.app/).
   - Clique em **New Project** > **Deploy from GitHub repo**.
   - Selecione o repositório `smartlearn-frontend`.

3. **Detecção Automática**:
   - O Railway identificará automaticamente o `Dockerfile` na raiz do projeto.
   - O Next.js escutará na porta fornecida pela variável de ambiente `PORT` do Railway e no host `0.0.0.0`.

4. **Gerar Domínio Público**:
   - No painel do serviço, acesse a aba **Settings**.
   - Na seção **Networking**, clique em **Generate Domain** (ou configure um domínio personalizado).

