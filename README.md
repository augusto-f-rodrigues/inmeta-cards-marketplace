
![inmeta-banner](https://github.com/augusto-f-rodrigues/inmeta-cards-marketplace/assets/85464318/b090cc25-2d1f-47b9-aaff-3554788bf4a9)

# Marketplace de Cards de Magic: The Gathering Arena

## Índice

- [Confira Agora](#confira-agora)
- [Recursos Principais](#recursos-principais)
- [Recursos Extras](#recursos-extras)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)

## Confira Agora

Deploy realizado na vercel, assim você pode testar a aplicação sem baixar nada (a API fica invativa quando não há nenhum uso, ao abrir a aplicação o loading pode demorar um pouco)

[https://duel-cards.vercel.app/](https://duel-cards.vercel.app/)

## Recursos Principais

- **Listagem de Trocas:** Visualização de todas as trocas realizadas pelo usuário logado.
- **Detalhes das Trocas:** Modal com informações detalhadas sobre cada troca.
- **Cartas Oferecidas e Recebidas:** Visualização das cartas oferecidas e recebidas em cada troca.
- **Interface Responsiva:** Design mobile-first, adaptável a diferentes dispositivos.
- **Feedback de Carregamento:** Indicador visual durante a busca de dados.
- **Gestão de Estado com Redux:** Uso do Redux Toolkit para gerenciamento eficiente do estado.
- **Exclusão de Trocas:** Possibilidade de deletar trocas com confirmação e atualização automática da lista.

## Recursos Extras

- **Navbar:** Barra de navegação para facilitar a movimentação entre as páginas.
- **Feedback Visual:** Mensagens de sucesso e erro ao realizar operações de exclusão.

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Material UI](https://mui.com/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Tailwind CSS](https://tailwindcss.com/)

## Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados.

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/inmeta-cards-marketplace
cd inmeta-cards-marketplace
npm install
```

## Scripts Disponíveis

- npm run dev: Inicia o servidor de desenvolvimento.
- npm run build: Cria a build de produção da aplicação.
- npm run start: Inicia o servidor da aplicação em modo de produção.
- npm run lint: Executa a verificação de lint para encontrar e corrigir problemas no código.

## Estrutura do Projeto

- components: Componentes reutilizáveis como Navbar, TradeCard e AppTradeDetailsModal.
- interfaces: Definições de interfaces TypeScript para tipagem segura.
- redux: Slices do Redux para gerenciamento de estado.
- services: Serviços para comunicação com a API.
- styles: Estilos globais e específicos da aplicação.
- pages: Páginas da aplicação, incluindo a principal de trocas (MyTrades).
