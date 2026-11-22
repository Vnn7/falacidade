import { useContext } from 'react';
import { CidadeContext } from '@/context/cidade-context';

export function useCidade() {
  const contexto = useContext(CidadeContext);
  if (!contexto) throw new Error('CidadeProvider não encontrado.');
  return contexto;
}
