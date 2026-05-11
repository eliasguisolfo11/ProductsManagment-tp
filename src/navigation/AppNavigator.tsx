import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import LoginScreen from '../screens/LoginScreen';
import MainMenuScreen from '../screens/MainMenuScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductFormScreen from '../screens/ProductFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainMenu"
        component={MainMenuScreen}
        options={{ title: 'Inicio', headerBackVisible: false }}
      />
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'Lista de Productos' }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={({ route }) => ({
          title: route.params?.product ? 'Modificar Producto' : 'Nuevo Producto',
        })}
      />
    </Stack.Navigator>
  );
}
