export function mensagemDoErro(erro: unknown): string {
  const codigo = (erro as { code?: string } | null)?.code;
  switch (codigo) {
    case 'permission-denied': return 'Sem permissão. Confira seu login e as regras do Firestore.';
    case 'unavailable': return 'Não foi possível conectar ao Firebase. Confira sua conexão e tente novamente.';
    case 'failed-precondition': return 'A consulta precisa de um índice no Firestore. Consulte o guia de configuração do projeto.';
    case 'auth/invalid-credential': return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use': return 'Este e-mail já tem uma conta. Use Entrar.';
    case 'auth/weak-password': return 'Use uma senha com pelo menos 6 caracteres.';
    case 'auth/invalid-email': return 'Informe um e-mail válido.';
    case 'auth/network-request-failed': return 'Sem conexão. Tente novamente.';
    case 'auth/operation-not-allowed': return 'Este método de login ainda não foi ativado no Firebase.';
    case 'auth/unauthorized-domain': return 'Este domínio precisa ser autorizado no Firebase Authentication.';
    case 'auth/popup-closed-by-user': return 'O login foi cancelado. Você pode tentar novamente.';
    case 'auth/popup-blocked': return 'Permita a janela de login no seu navegador.';
    case 'auth/too-many-requests': return 'Muitas tentativas. Aguarde um pouco antes de tentar novamente.';
    default: return erro instanceof Error ? erro.message : 'Não foi possível concluir. Tente novamente.';
  }
}
