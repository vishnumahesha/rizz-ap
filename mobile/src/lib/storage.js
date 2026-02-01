import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "rizz_ai_favorites_v1";

export async function getFavorites() {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export async function saveFavorites(favorites) {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export async function toggleFavorite(reply) {
  const favorites = await getFavorites();
  const exists = favorites.some((item) => item.id === reply.id);
  const next = exists
    ? favorites.filter((item) => item.id !== reply.id)
    : [reply, ...favorites];
  await saveFavorites(next);
  return next;
}

export async function removeFavorite(id) {
  const favorites = await getFavorites();
  const next = favorites.filter((item) => item.id !== id);
  await saveFavorites(next);
  return next;
}
