import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { loginUser, registerUser, getPasswordByUser } from '../database/database';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !contrasenia.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    setLoading(true);
    try {
      const user = await loginUser(usuario.trim(), contrasenia.trim());
      if (user) {
        navigation.replace('MainMenu', { usuario: user.usuario });
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch {
      Alert.alert('Error', 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!usuario.trim() || !contrasenia.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    setLoading(true);
    try {
      await registerUser(usuario.trim(), contrasenia.trim());
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      const user = await loginUser(usuario.trim(), contrasenia.trim());
      if (user) {
        navigation.replace('MainMenu', { usuario: user.usuario });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!usuario.trim()) {
      Alert.alert('Recuperar contraseña', 'Contacte al administrador para restablecer su contraseña');
      return;
    }
    try {
      const password = await getPasswordByUser(usuario.trim());
      if (password) {
        Alert.alert('Recuperar contraseña', `Su contraseña es: ${password}`);
      } else {
        Alert.alert('Recuperar contraseña', 'El usuario no existe. Contacte al administrador.');
      }
    } catch {
      Alert.alert('Error', 'Error al recuperar la contraseña');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#999"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        value={contrasenia}
        onChangeText={setContrasenia}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#4A90D9" style={styles.loader} />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotText}>Olvidé mi contraseña</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4A90D9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotText: {
    color: '#4A90D9',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
  loader: {
    marginVertical: 20,
  },
});
