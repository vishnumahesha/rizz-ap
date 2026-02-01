import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import GeneratorScreen from "./src/screens/GeneratorScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import PhoneFrame from "./src/components/PhoneFrame";
import DemoPanel from "./src/components/DemoPanel";

const Stack = createNativeStackNavigator();

export default function App() {
  const [demoPrompt, setDemoPrompt] = useState(null);
  const isWeb = Platform.OS === "web";
  const content = (
    <PhoneFrame>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator>
          <Stack.Screen
            name="Generator"
            options={{ headerShown: false }}
          >
            {(props) => (
              <GeneratorScreen {...props} demoPrompt={demoPrompt} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PhoneFrame>
  );

  return (
    <View style={styles.app}>
      {isWeb ? (
        <View style={styles.webLayout}>
          {content}
          <DemoPanel onSelectPrompt={setDemoPrompt} />
        </View>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  webLayout: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 0,
  },
});
