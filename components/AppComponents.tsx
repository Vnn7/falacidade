import Ionicons from '@expo/vector-icons/Ionicons';
import { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/components/AuthContext';

export function LoginStatus() {
  const { login } = useAuth();

  return (
    <View style={[styles.loginStatus, login === 1 ? styles.loginOn : styles.loginOff]}>
      <View style={[styles.loginDot, { backgroundColor: login === 1 ? Colors.green : Colors.red }]} />
      <Text style={styles.loginText}>
        {login === 1 ? 'Usuário logado' : 'Navegando como visitante'}
      </Text>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle | ViewStyle[] }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  title,
  onPress,
  outline = false,
  icon,
  disabled = false,
  style
}: {
  title: string;
  onPress: () => void;
  outline?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        outline ? styles.buttonOutline : styles.buttonPrimary,
        pressed && !disabled && { opacity: 0.82 },
        disabled && { opacity: 0.45 },
        style
      ]}>
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={outline ? Colors.text : Colors.white}
        />
      ) : null}
      <Text style={[styles.buttonText, outline && { color: Colors.text }]}>{title}</Text>
    </Pressable>
  );
}

export function Pill({
  text,
  active,
  onPress
}: {
  text: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{text}</Text>
    </Pressable>
  );
}

export function Field({
  icon,
  placeholder,
  value,
  onChangeText,
  multiline = false
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value?: string;
  onChangeText?: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <View style={[styles.field, multiline && { alignItems: 'flex-start', minHeight: 74 }]}>
      {icon ? <Ionicons name={icon} size={18} color={Colors.faint} /> : null}
      {onChangeText ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.faint}
          multiline={multiline}
          style={[styles.input, multiline && { textAlignVertical: 'top' }]}
        />
      ) : (
        <Text style={styles.fieldText}>{placeholder}</Text>
      )}
    </View>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function MapBox({ children, small = false }: { children?: ReactNode; small?: boolean }) {
  return (
    <View style={[styles.map, small && { height: 105 }]}>
      <View style={[styles.roadV, { left: '48%' }]} />
      <View style={[styles.roadH, { top: '31%' }]} />
      <View style={[styles.roadH, { top: '64%' }]} />
      <View style={[styles.block, { top: '7%', left: '6%' }]} />
      <View style={[styles.block, { bottom: '8%', right: '7%' }]} />
      {children}
    </View>
  );
}

export function Pin({
  top,
  left,
  color,
  onPress
}: {
  top: `${number}%`;
  left: `${number}%`;
  color: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={[styles.pin, { top, left }]}>
      <Ionicons name="location" size={31} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loginStatus: {
    minHeight: 30,
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  loginOn: { backgroundColor: Colors.greenSoft },
  loginOff: { backgroundColor: '#fdecec' },
  loginDot: { width: 7, height: 7, borderRadius: 4 },
  loginText: { color: Colors.text, fontSize: 10.5, fontWeight: '700' },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 12
  },
  button: {
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  buttonPrimary: {
    backgroundColor: Colors.green
  },
  buttonOutline: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14
  },
  pill: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: Colors.white
  },
  pillActive: {
    borderColor: Colors.green,
    backgroundColor: Colors.greenSoft
  },
  pillText: {
    color: Colors.muted,
    fontSize: 11.5,
    fontWeight: '600'
  },
  pillTextActive: {
    color: Colors.green
  },
  field: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 13
  },
  fieldText: {
    flex: 1,
    color: Colors.muted,
    fontSize: 13
  },
  sectionTitle: {
    color: Colors.muted,
    fontSize: 10.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2
  },
  map: {
    height: 390,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#e5eddf',
    position: 'relative'
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 17,
    backgroundColor: Colors.white
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 17,
    backgroundColor: Colors.white
  },
  block: {
    position: 'absolute',
    width: '31%',
    height: '16%',
    borderRadius: 10,
    backgroundColor: '#d4dfcf'
  },
  pin: {
    position: 'absolute',
    marginLeft: -14,
    marginTop: -25
  }
});
