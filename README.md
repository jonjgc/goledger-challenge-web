# GoLedger TV Shows

Uma aplicação web moderna, responsiva e robusta para gerenciamento de um catálogo de Séries, Temporadas, Episódios e Watchlists.

**[Acesse o projeto em produção aqui](https://goledger-challenge-web-five.vercel.app/tvshows)**

## Funcionalidades Implementadas

- **CRUD Completo:** Criação, leitura, atualização e exclusão para todas as entidades (TV Shows, Seasons, Episodes e Watchlists).
- **Relacionamentos** - Selects em cascata (Ex: ao criar um episódio, você seleciona a série e o sistema filtra as temporadas disponíveis apenas para aquela série).
  - Seleção múltipla via Checkboxes dinâmicos para a montagem de Watchlists.
- **Feedbacks Visuais usando Toasts:** Alertas em tempo real de sucesso ou erro nas requisições, melhorando a fluidez da navegação (usando Sonner).
- **Paginação:** Navegação entre páginas, incluindo botões para ir ao início e ao fim da lista.
- **Tratamento de Datas e Timezones:** Conversão correta de horários de UTC para o fuso local do usuário na edição de episódios, evitando o bug de "timezone".
- **Sincronização de Cache:** Utilização avançada do React Query para invalidar chaves de cache e atualizar a interface automaticamente após mutações, sem necessidade de refresh manual.

## Tecnologias Utilizadas

- **[Next.js 14]**(App Router)
- **[React]**
- **[TypeScript]**
- **[Tailwind CSS]** (Estilização)
- **[Shadcn UI]** (Componentes acessíveis e customizáveis)
- **[React Query]** (Gerenciamento de estados assíncronos e cache)
- **[React Hook Form]** + **[Zod]** (Construção e validação de formulários)
- **[Axios]** (Requisições HTTP)

---

## Como rodar o projeto localmente

Siga os passos abaixo para testar a aplicação na sua máquina:

1. **Clone o repositório:**

```bash
git clone https://github.com/jonjgc/goledger-challenge-web.git
```

2. **Acesse a pasta do projeto:**

```bash
cd goledger-challenge-web
```

3. **Instale as dependências**

```bash
npm install
```

4. **Configuração da variáveis de ambiente**
Crie um arquivo chamado .env.local na raiz do projeto e adicione a sua chave de autenticação Basic (em base64):

```bash
NEXT_PUBLIC_BASIC_AUTH=Z29sZWRnZXI6NU54VkNBakM=
```

5. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

6. **Abra http://localhost:3000 no seu navegador para ver o resultado.**


