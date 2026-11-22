# Conferência da entrega N3

A imagem do formulário informa o prazo de **23/11/2026 às 23:59**, trabalho individual, dois desafios somados na nota final e envio do **link do Git**.

## Arquivos para avaliação

| Requisito | Implementação |
| --- | --- |
| Configurar e exportar Firestore | `firebase-config.ts` |
| Gravar na coleção ocorrencias | `services/reportes.ts` |
| Título obrigatório e descrição opcional | `app/novo-reporte.tsx` |
| Validar login e GPS | Formulário, serviço e regras |
| Id automático, uid e horário do servidor | `addDoc`, `auth.currentUser.uid`, `serverTimestamp` |
| Substituir dados fictícios | `services/ocorrencias.ts` e `app/(tabs)/mapa.tsx` |
| 50 reportes, mais novos primeiro | `orderBy('criadoEm', 'desc')` e `limit(50)` |
| Atualizar ao voltar | `hooks/use-ocorrencias.ts` com `useFocusEffect` |
| Pinos por status | `components/mapa-view.tsx` |
| Lista e estado vazio | `app/lista-de-reportes.tsx` com `FlatList` |
| Acesso pelo perfil | `app/(tabs)/explore.tsx` |
| Categoria e endereço | Formulário, tipos, serviço e regras |
| Carregamento, datas e atualização manual | Formulário, hook e lista |
| Meus reportes | Filtro `where` antes do limite e índice versionado |

O projeto recebido era um protótipo mais antigo do que a base dos PDFs: não tinha autenticação Firebase, GPS nem mapa nativo. Essas estruturas foram implementadas aqui, mantendo Expo SDK 54 e o visual existente.

A rota antiga `/reporte` redireciona o código para o mesmo formulário novo. O perfil se chama `explore.tsx` na estrutura original; essa é a aba **Perfil**. Os nomes diferentes dos arquivos da base foram respeitados.

## Verificações locais executadas

- TypeScript e ESLint.
- 8 testes de validação/conversão.
- 7 testes com o emulador oficial do Firestore, incluindo gravação persistida e bloqueio de escritas inválidas.
- 2 testes no navegador: navegação visitante e recusa de envio sem título/login.
- 1 teste completo no navegador com Authentication e Firestore emulados: criação de conta, dois reportes, persistência, ordenação, filtro e detalhe.
- Empacotamento para web e Android.
- Validação pelo aplicativo com o Firebase real: criação de conta por e-mail, dois reportes, sessão após recarregar, ordenação, filtro, atualização e detalhe. [Evidência](VALIDACAO_FIREBASE_REAL.md).
- Android físico do responsável: mapa com ruas, localização atual, nome da cidade e contagem dos reportes confirmados por captura enviada na conversa.

O emulador não exige acesso à conta Google. Os testes de recusa geram mensagens `PERMISSION_DENIED` esperadas; a execução deve terminar com todos os testes aprovados.

## Pendências que exigem a conta do responsável

O código está publicado na branch `main` de [Vnn7/falacidade](https://github.com/Vnn7/falacidade).

O Firebase `falacidade-vnn7-n3` e o Firestore de São Paulo estão criados, com regras/índice publicados. Google e e-mail/senha estão habilitados. O `.env` local está preenchido e dois reportes de demonstração foram gravados pelo próprio aplicativo na nuvem.

- Ao clonar em outro computador, preencher o `.env` com o app cadastrado.
- Conferir um pino e um envio no Android físico. O mapa e o GPS já foram observados no aparelho; os dois reportes de demonstração ficam em Cuiabá, fora do trecho exibido na captura. O login Google foi confirmado pelo responsável no navegador.
- Conferir o link público com os commits e preencher o formulário com nome completo e link.

Os comentários dos desafios e extras foram revisados em linguagem simples, em primeira pessoa, explicando a função de cada trecho. Eles servem também como apoio para estudar o funcionamento do aplicativo. Os extras foram implementados; a nota depende da avaliação do professor.

Não envie apenas o link do repositório antigo sem publicar os commits desta atividade. Não é necessário enviar `node_modules`, `.env` ou tokens.
