# Configurar Firebase e testar o aplicativo

Esta configuração precisa ser feita na conta Google do responsável. Não envie senhas, tokens administrativos ou chaves de service account para o repositório.

**Estado desta entrega:** o projeto `falacidade-vnn7-n3`, o aplicativo Web, o Firestore em `southamerica-east1`, as regras/índice e os provedores Google/e-mail já estão configurados. O `.env` local já foi preenchido. O app criou uma conta por e-mail e dois reportes de demonstração no banco real. As instruções abaixo servem para reproduzir a configuração em outro projeto ou preparar outro computador.

## 1. Criar projeto, aplicativo e banco

1. Acesse [Firebase Console](https://console.firebase.google.com/) e crie um projeto para o Falaa Buraco. Analytics é opcional.
2. Em **Configurações do projeto → Seus apps**, registre um aplicativo **Web**.
3. Copie os valores do objeto `firebaseConfig` para as variáveis correspondentes de `.env.example`, salvas em um arquivo local `.env`.
4. Em **Build → Firestore Database**, crie o banco padrão, edição Standard, no modo **produção**, região **southamerica-east1 (São Paulo)**.
5. Em **Authentication → Sign-in method**, ative **Google**, escolha o e-mail de suporte e salve.
6. Ative também **E-mail/senha** para testar no Expo Go.
7. Em **Authentication → Settings → Authorized domains**, autorize **localhost** para o desenvolvimento web e o domínio que usar posteriormente.

As variáveis `EXPO_PUBLIC_*` identificam o app cliente e são incluídas no bundle pelo Expo. A proteção do banco vem da autenticação e das regras. Nenhuma chave administrativa é necessária no app.

## 2. Publicar as regras e o índice

No terminal, na raiz deste projeto:

```bash
npx firebase login
npx firebase deploy --only firestore:rules,firestore:indexes --project SEU_ID_DO_PROJETO
```

O Firebase CLI é instalado com as dependências de desenvolvimento. O comando publica os arquivos `firestore.rules` e `firestore.indexes.json` neste projeto.

Alternativa pelo console:

- Cole `firestore.rules` na aba **Firestore → Regras** e publique.
- Em **Índices → Composto**, crie o índice da coleção `ocorrencias`, escopo **Coleção**, campos `idNotificante` ascendente e `criadoEm` descendente.
- Aguarde o índice terminar de construir antes de usar **Meus reportes**.

As regras permitem leitura pública e criação apenas com o uid da sessão, status inicial aberto, GPS e campos válidos. Edição/exclusão ficam bloqueadas.

## 3. Testar sem build própria

```bash
npm start
```

No Expo Go compatível com SDK 54, entre ou crie uma conta com **e-mail e senha**, permita o GPS e abra o botão **+** do mapa.

No navegador:

```bash
npm run web
```

Use **Entrar com Google**, permita a janela de login e a localização. Google na web usa `signInWithPopup` do Firebase; não exige Client ID explícito em `.env`. O login com e-mail também funciona.

Geocodificação reversa pode não estar disponível no navegador. Nesse caso, o reporte é salvo com GPS e endereço nulo, e a tela avisa. O mapa é nativo; a lista permite conferir os reportes no navegador.

## 4. Google e mapa em uma build própria

Para Google no Android:

1. Registre um app Android no mesmo Firebase, pacote **com.vnn7.falaaburaco**.
2. Cadastre as impressões SHA-1/SHA-256 da chave que assina sua build.
3. Ative o provedor Google e copie o OAuth Client ID do tipo **Web** para `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
4. Use uma build nativa, por exemplo `npx expo run:android` com Android Studio/SDK configurado. O Google Sign-In é vinculado automaticamente no Android.
5. Para o mapa dessa build, habilite o Maps SDK for Android e preencha `GOOGLE_MAPS_ANDROID_API_KEY` com uma chave restrita ao seu pacote e assinatura. Refaça a build após alterar essa configuração.

Para iOS:

1. Registre o app **com.vnn7.falaaburaco** e seu OAuth Client ID iOS.
2. Preencha `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` e `GOOGLE_IOS_URL_SCHEME` com o esquema reverso `com.googleusercontent.apps.…` da configuração iOS.
3. Gere a build no macOS ou em um serviço de build da sua conta.

**Não tente Google nativo pelo Expo Go:** esse cliente não inclui o módulo Google Sign-In. O app oferece e-mail/senha para esse cenário e explica a limitação ao tocar em Google.

## 5. Conferência final com a conta real

- Crie **pelo menos dois reportes** autenticados.
- Confira os documentos em **Firestore → Dados → ocorrencias**.
- Confira `titulo`, `descricao`, `status`, `latitude`, `longitude`, `idNotificante`, `criadoEm`, `tipo` e `endereco`.
- Volte ao mapa: o novo pino aparece sem reiniciar o app.
- Abra **Perfil → Ver reportes**: os mais recentes aparecem primeiro.
- Teste **Meus reportes**, data/hora e puxar para atualizar.
- Sem título ou sem login, o envio é recusado.
- Sem GPS, a criação é recusada; a consulta da lista continua disponível.
- Se o GPS estiver bloqueado permanentemente, habilite a localização nos ajustes do aparelho/navegador.

## Erros frequentes

| Erro | Verificação |
| --- | --- |
| Sem permissão | Login real ativo e regras publicadas no projeto correto. |
| Consulta precisa de índice | Publique `firestore.indexes.json` e aguarde a construção. |
| Domínio não autorizado | Autorize o domínio usado em Authentication. |
| Nenhum reporte apesar de haver documentos | A consulta ordena por `criadoEm`; documentos sem esse campo não entram. |
| Google nativo não abre | Build própria, Client IDs, pacote e SHA corretos. |
| Endereço indisponível | GPS continua válido; o endereço opcional pode ficar nulo. |

As verificações locais e o emulador não comprovam a configuração OAuth, índices de produção, permissões do aparelho ou conectividade da conta real. Faça a conferência acima antes de considerar a entrega validada ponta a ponta.
