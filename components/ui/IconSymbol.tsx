import Ionicons from '@expo/vector-icons/Ionicons';
export function IconSymbol({ name = 'ellipse', size = 24, color = '#000' }: { name?: any; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} />;
}
