# Validação com Firebase real

Em **22/11/2026**, o aplicativo foi testado no navegador contra o projeto **falacidade-vnn7-n3**, usando os serviços reais de Authentication e Firestore.

O teste criou uma conta de demonstração por e-mail/senha e enviou dois reportes pelo formulário. As gravações usaram a sessão do cliente e passaram pelas regras publicadas; não foram inseridas com credencial administrativa.

| Registro | Coordenadas simuladas | Horário de Cuiabá |
| --- | --- | --- |
| Demonstração N3 - iluminação | -15.600000, -56.100000 | 22/11/2026, 14:30:12 |
| Demonstração N3 - calçada | -15.601000, -56.102000 | 22/11/2026, 14:30:13 |

Os textos deixam claro que são registros acadêmicos e não representam ocorrências reais.

Foram conferidos:

- Login por e-mail e restauração da sessão após recarregar a página.
- Título, descrição, tipo, coordenadas, autor, status inicial e timestamp do servidor.
- Retorno ao mapa com os novos dados, sem reiniciar o app.
- Lista com o registro mais novo primeiro, filtro por autor e atualização manual.
- Abertura do detalhe consultando o documento por id.
- Persistência dos dois documentos conferida diretamente na API do Firestore.
- Nenhum erro de execução do aplicativo durante o teste aprovado.

![Lista usando o Firebase real](imagens/lista-firebase-real.png)

O provedor Google está habilitado no projeto. O teste automatizado acima usou e-mail/senha; o titular também confirmou o login Google no navegador, com abertura do mapa e carregamento dos dois reportes.

O mapa nativo foi incluído e empacotado para Android. O navegador mostra a lista e informa que o mapa está disponível no Android/iOS; esse teste não substitui a conferência dos pinos e do GPS em um aparelho real.

As credenciais da conta de demonstração, o `.env`, os tokens do CLI e a configuração administrativa não são incluídos no repositório.
