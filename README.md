# 📊 B3 Market Terminal

> Sistema integrado de consulta de ativos da B3, liquidação e análise de mercado.

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)

---

## 🚀 Sobre o projeto

O **B3 Market Terminal** é uma aplicação web full-stack voltada para o mercado financeiro brasileiro. Ele centraliza em uma única interface a consulta de ativos listados na B3, informações sobre liquidação e indicadores de mercado.

O projeto foi desenvolvido com foco em performance, tipagem estática e uma UI limpa — pensado tanto para investidores quanto para profissionais de mercado de capitais.

---

## ✨ Funcionalidades

- **Consulta de ativos** — busca e visualização de informações de ações, FIIs e outros instrumentos da B3
- **Análise de mercado** — gráficos e indicadores integrados via Recharts
- **Liquidação** — informações sobre ciclos de liquidação (D+2, etc.)
- **Interface responsiva** — UI construída com Tailwind CSS e animações com Motion

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript |
| Build | Vite 6 |
| Backend | Express (Node.js via TSX) |
| Estilização | Tailwind CSS 4 |
| Gráficos | Recharts |
| Animações | Motion |
| Ícones | Lucide React |

---

## 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)

---

## ⚙️ Como rodar localmente

**1. Clone o repositório**
```bash
git clone https://github.com/V1tinho/B3-Market-Terminal.git
cd B3-Market-Terminal
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

**4. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (Express + Vite) |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run lint` | Verifica erros de tipagem com TypeScript |
| `npm run clean` | Remove a pasta `dist` |

---

## 🗂️ Estrutura do projeto
```
B3-Market-Terminal/
├── src/              # Código-fonte React (componentes, páginas, hooks)
├── server.ts         # Servidor Express (proxy de API, rotas backend)
├── index.html        # Entry point HTML
├── vite.config.ts    # Configuração do Vite
├── tsconfig.json     # Configuração do TypeScript
├── .env.example      # Exemplo de variáveis de ambiente
└── package.json      # Dependências e scripts
```

---

## 🌐 Demo online

Acesse a versão publicada no AI Studio:
[https://ai.studio/apps/68c0c6cd-8dbb-4b15-bb8e-d975e009a454](https://ai.studio/apps/68c0c6cd-8dbb-4b15-bb8e-d975e009a454)

---

## 📄 Licença

Este projeto é de uso pessoal. Para fins de uso ou distribuição, entre em contato com o autor.

---

<p align="center">
  Desenvolvido por <a href="https://github.com/V1tinho">V1tinho</a>
</p>
