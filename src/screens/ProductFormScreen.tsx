import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Product } from '../types';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../database/database';

type ProductFormScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductForm'>;
  route: RouteProp<RootStackParamList, 'ProductForm'>;
};

export default function ProductFormScreen({ navigation, route }: ProductFormScreenProps) {
  const editingProduct = route.params?.product;
  const isEditing = !!editingProduct;

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [disponibilidad_envio, setDisponibilidadEnvio] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setCodigo(editingProduct.codigo);
      setNombre(editingProduct.nombre);
      setStock(String(editingProduct.stock));
      setDescripcion(editingProduct.descripcion || '');
      setPrecio(String(editingProduct.precio));
      setDisponibilidadEnvio(editingProduct.disponibilidad_envio === 1);
    }
  }, [editingProduct]);

  const validate = () => {
    if (!codigo.trim()) { Alert.alert('Error', 'El código es obligatorio'); return false; }
    if (!nombre.trim()) { Alert.alert('Error', 'El nombre es obligatorio'); return false; }
    if (!stock.trim() || isNaN(Number(stock))) { Alert.alert('Error', 'Stock debe ser un número'); return false; }
    if (!precio.trim() || isNaN(Number(precio))) { Alert.alert('Error', 'Precio debe ser un número'); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEditing) {
        await updateProduct({
          id: editingProduct!.id,
          codigo: codigo.trim(),
          nombre: nombre.trim(),
          stock: parseInt(stock, 10),
          descripcion: descripcion.trim() || null,
          precio: parseFloat(precio),
          disponibilidad_envio: disponibilidad_envio ? 1 : 0,
        });
        Alert.alert('Éxito', 'Producto modificado correctamente');
      } else {
        await createProduct({
          codigo: codigo.trim(),
          nombre: nombre.trim(),
          stock: parseInt(stock, 10),
          descripcion: descripcion.trim() || null,
          precio: parseFloat(precio),
          disponibilidad_envio: disponibilidad_envio ? 1 : 0,
        });
        Alert.alert('Éxito', 'Producto creado correctamente');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar',
      '¿Está seguro de eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            try {
              await deleteProduct(editingProduct!.id);
              Alert.alert('Éxito', 'Producto eliminado correctamente');
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Error al eliminar producto');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isEditing ? 'Modificar Producto' : 'Nuevo Producto'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Código *"
        placeholderTextColor="#999"
        value={codigo}
        onChangeText={setCodigo}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre *"
        placeholderTextColor="#999"
        value={nombre}
        onChangeText={setNombre}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Stock *"
          placeholderTextColor="#999"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Precio *"
          placeholderTextColor="#999"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="decimal-pad"
        />
      </View>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Descripción"
        placeholderTextColor="#999"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={3}
      />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Disponibilidad de envío</Text>
        <Switch
          value={disponibilidad_envio}
          onValueChange={setDisponibilidadEnvio}
          trackColor={{ false: '#ddd', true: '#4A90D9' }}
        />
      </View>

      {saving ? (
        <ActivityIndicator size="large" color="#4A90D9" style={styles.loader} />
      ) : (
        <>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>
              {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
            </Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.buttonText}>Eliminar Producto</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 15,
    color: '#333',
  },
  multilineInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 15,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4A90D9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
});
