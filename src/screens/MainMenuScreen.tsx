import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type MainMenuScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainMenu'>;
};

export default function MainMenuScreen({ navigation }: MainMenuScreenProps) {
  const route = useRoute<RouteProp<RootStackParamList, 'MainMenu'>>();
  const { usuario } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido, {usuario}</Text>
      <Text style={styles.subtitle}>Gestión de Productos</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ProductList')}
      >
        <Text style={styles.buttonIcon}>📋</Text>
        <Text style={styles.buttonText}>Lista de Productos</Text>
        <Text style={styles.buttonDesc}>Ver, modificar y eliminar productos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.addButton]}
        onPress={() => navigation.navigate('ProductForm', {})}
      >
        <Text style={styles.buttonIcon}>➕</Text>
        <Text style={styles.buttonText}>Agregar Producto</Text>
        <Text style={styles.buttonDesc}>Registrar un nuevo producto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  addButton: {
    borderColor: '#34C759',
    borderWidth: 1.5,
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  buttonDesc: {
    fontSize: 13,
    color: '#999',
  },
});
