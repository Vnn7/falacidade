# Falaa Buraco!! — Atividade N3

Aplicativo de participação cidadã em **React Native, Expo SDK 54, Expo Router e Firebase**.
Implementa os desafios de gravar e listar reportes e os extras propostos nos PDFs da avaliação.

**Repositório da entrega:** [Vnn7/falacidade](https://github.com/Vnn7/falacidade).

Desenvolvido sobre o repositório [Vnn7/FalaBuraco-Mar](https://github.com/Vnn7/FalaBuraco-Mar), preservando a identidade visual do projeto original.

## O que foi implementado

| Desafio | Resultado |
| --- | --- |
| 1 — Gravar no Firebase | Formulário com título, descrição, GPS e autor autenticado; gravação na coleção `ocorrencias`, id automático, status `aberto` e horário do servidor. |
| 2 — Listar do Firebase | Consulta dos 50 mais recentes, pinos com cores por status no Android/iOS, lista com `FlatList` e recarga ao voltar à tela. |
| Extras do desafio 1 | Categoria por botões, endereço por geocodificação reversa e indicador de envio. |
| Extras do desafio 2 | Data/hora, filtro por autor no Firestore e puxar para atualizar. |
| Melhorias adicionais | Login Firebase real, login por e-mail no Expo Go, bloqueio de toques duplicados, estados de erro, validação de documentos e regras de criação. |

A aba **Perfil → Ver reportes** abre a lista. O botão **+** no mapa abre o formulário.
O mapa nativo usa coordenadas reais; a versão web direciona para a lista em vez de desenhar pinos fictícios.

## Estado da configuração

**O projeto Firebase `falacidade-vnn7-n3` está criado, com Firestore Standard na região São Paulo, regras e índice publicados. A leitura do banco real foi validada. A ativação inicial do Authentication no console e o teste autenticado na nuvem ainda estão pendentes.**

O `.env` deste computador já aponta para esse projeto. Em outra máquina, preencha o arquivo com a configuração do aplicativo Web disponível no console. A `.firebaserc` identifica o projeto usado nesta entrega.

Sem `.env`, o app abre em modo visitante e informa a configuração pendente. Não simula autenticação nem confirma gravações inexistentes. Os testes não exigem uma conta Firebase e não escrevem na nuvem.

Consulte [CONFIGURACAO_FIREBASE.md](CONFIGURACAO_FIREBASE.md) para ativar o banco e o login e [docs/ENTREGA_N3.md](docs/ENTREGA_N3.md) para conferir a entrega.

## Executar

Pré-requisitos: **Node.js 24.12 ou superior** e npm.

```bash
npm ci
```

Copie `.env.example` para `.env` e preencha a configuração do seu projeto:

```powershell
Copy-Item .env.example .env
```

```bash
npm start
```

- **Expo Go:** mapa nativo, GPS, envio e consulta; entre por e-mail/senha.
- **Web:** `npm run web`; login Google via janela do Firebase, formulário e lista. O mapa nativo não está disponível no navegador.
- **Google no Android/iOS:** requer build própria e configuração OAuth descrita no guia. O módulo de login Google não está incluído no Expo Go.

O SDK 54 foi mantido por ser a versão do projeto inicial. Use um Expo Go compatível ou uma build de desenvolvimento.

## Verificações

```bash
npm run typecheck
npm run lint
npm test
npm run test:rules
npm run export:android
npm run export:web
npx playwright install chromium
npm run test:e2e
npm run test:app
```

- `npm test`: 8 testes de validação e conversão.
- `npm run test:rules`: 7 testes no emulador, incluindo persistência, permissões, ordenação e filtro. Requer **Java 21+** no PATH. O primeiro uso baixa o emulador.
- `npm run test:e2e`: 2 testes de navegação e validação como visitante. Execute o export web antes, sem credenciais em `.env`.
- `npm run test:app`: 1 teste completo do aplicativo com Auth e Firestore locais. Cria uma conta, envia dois reportes, confere os campos gravados, a atualização ao voltar, a ordem, o filtro e o detalhe. Requer Java 21+ e Chromium instalado pelo Playwright. O GPS é fornecido pelo navegador de teste; os serviços do app e os emuladores executam de verdade.
- As exportações verificam o empacotamento JavaScript. Não geram um APK nem substituem teste no aparelho.
- A integração contínua repete essas verificações em cada push/PR.

Os `overrides` no `package.json` mantêm `@firebase/app` e `@firebase/app-compat` nas versões correspondentes ao Firebase 12.19.0. Isso evita carregar registros internos diferentes, conflito detectado e corrigido nos testes de integração.

## Organização

```text
app/novo-reporte.tsx        Formulário do desafio 1
app/lista-de-reportes.tsx   Lista do desafio 2
app/(tabs)/mapa.tsx         Mapa, busca e filtros
app/(tabs)/explore.tsx      Perfil e acesso aos reportes
app/detalhe.tsx             Consulta de um reporte por id
components/AuthContext.tsx Sessão real do Firebase
context/cidade-context.tsx GPS e cidade
firebase-config.ts         Inicialização de Auth e Firestore
services/reportes.ts       Gravação
services/ocorrencias.ts    Consultas
services/dados-reporte.ts  Validação e conversão
hooks/use-ocorrencias.ts   Recarga no foco, estados e atualização
firestore.rules            Regras de acesso e validação
firestore.indexes.json     Índice do filtro por autor/data
tests/                     Testes automatizados
```

As telas antigas de ranking, notificações e prefeitura foram preservadas como protótipos fora do fluxo desta atividade. Ranking e notificações ficam ocultos nas abas; não são dados reais do Firebase.

## Referências

- [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)
- [Expo Location](https://docs.expo.dev/versions/v54.0.0/sdk/location/)
- [Login Google no Firebase](https://firebase.google.com/docs/auth/web/google-signin)
- [Adicionar documentos ao Firestore](https://firebase.google.com/docs/firestore/manage-data/add-data)
- [Regras do Firestore](https://firebase.google.com/docs/firestore/security/rules-conditions)
