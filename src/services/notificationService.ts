import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * Notificações LOCAIS (no aparelho), sem backend/push remoto.
 * Não suportado na Web — as funções viram no-op nesse caso.
 */

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

// Evita notificar a mesma lavoura repetidamente na mesma sessão (anti-spam).
const notifiedRegionIds = new Set<string>();
let permissionGranted = false;
let permissionAsked = false;

async function ensurePermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (permissionGranted) return true;
  try {
    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== 'granted' && !permissionAsked) {
      permissionAsked = true;
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
    permissionGranted = status === 'granted';
    if (permissionGranted && Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('alertas', {
        name: 'Alertas de lavoura',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
    return permissionGranted;
  } catch {
    return false;
  }
}

/** Dispara uma notificação local quando a lavoura está em estado crítico. */
export async function notifyCriticalRegion(regionId: string, regionName: string): Promise<void> {
  if (Platform.OS === 'web') return;
  if (notifiedRegionIds.has(regionId)) return;

  const granted = await ensurePermission();
  if (!granted) return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Alerta crítico na lavoura',
        body: `O AgroSat identificou risco crítico em ${regionName}. Verifique os indicadores climáticos e o índice de saúde.`,
      },
      trigger: null, // imediata
    });
    notifiedRegionIds.add(regionId);
  } catch {
    // falha silenciosa — nunca quebrar o fluxo do app por causa de notificação
  }
}
