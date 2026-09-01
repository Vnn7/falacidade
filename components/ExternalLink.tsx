import { Link, LinkProps } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { Platform } from 'react-native';

export function ExternalLink(props: LinkProps & { href: string }) {
  return (
    <Link
      target="_blank"
      {...props}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault();
          await openBrowserAsync(props.href);
        }
      }}
    />
  );
}
