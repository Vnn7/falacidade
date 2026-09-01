import { ReactNode, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export function Collapsible({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable onPress={() => setOpen(!open)}><Text>{title}</Text></Pressable>
      {open ? children : null}
    </View>
  );
}
