import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Falaa Buraco!!',
  slug: 'projeto-falaa-bucaro',
  android: {
    ...config.android, package: 'com.vnn7.falaaburaco',
    config: process.env.GOOGLE_MAPS_ANDROID_API_KEY
      ? { googleMaps: { apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY } } : undefined,
  },
  ios: { ...config.ios, bundleIdentifier: 'com.vnn7.falaaburaco' },
  plugins: [
    ...(config.plugins ?? []),
    ['expo-location', { locationWhenInUsePermission: 'Usamos sua localização para posicionar o reporte na cidade.' }],
    // Android faz autolink do módulo. iOS também precisa registrar o esquema OAuth.
    ...(process.env.GOOGLE_IOS_URL_SCHEME
      ? [['@react-native-google-signin/google-signin', { iosUrlScheme: process.env.GOOGLE_IOS_URL_SCHEME }] as [string, Record<string, string>]] : []),
  ],
});
