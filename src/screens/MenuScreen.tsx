import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../database/database';

type MenuScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Menu'>;
};

const emptyForm = {
  codigo: '',
  nombre: '',
  stock: '',
  descripcion: '',
  precio: '',
  disponibilidad_envio: false,
};

export default function MenuScreen({ navigation }: MenuScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [disponibilidad_envio, setDisponibilidadEnvio] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch {
      Alert.alert('Error', 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const clearForm = () => {
    setSelectedId(null);
    setCodigo('');
    setNombre('');
    setStock('');
    setDescripcion('');
    setPrecio('');
    setDisponibilidadEnvio(false);
  };

  const selectProduct = (product: Product) => {
    setSelectedId(product.id);
    setCodigo(product.codigo);
    setNombre(product.nombre);
    setStock(String(product.stock));
    setDescripcion(product.descripcion || '');
    setPrecio(String(product.precio));
    setDisponibilidadEnvio(product.disponibilidad_envio === 1);
  };

  const validateForm = () => {
    if (!codigo.trim()) { Alert.alert('Error', 'El código es obligatorio'); return false; }
    if (!nombre.trim()) { Alert.alert('Error', 'El nombre es obligatorio'); return false; }
    if (!stock.trim() || isNaN(Number(stock))) { Alert.alert('Error', 'Stock debe ser un número'); return false; }
    if (!precio.trim() || isNaN(Number(precio))) { Alert.alert('Error', 'Precio debe ser un número'); return false; }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await createProduct({
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        stock: parseInt(stock, 10),
        descripcion: descripcion.trim() || null,
        precio: parseFloat(precio),
        disponibilidad_envio: disponibilidad_envio ? 1 : 0,
      });
      clearForm();
      await loadProducts();
      Alert.alert('Éxito', 'Producto creado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear producto');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (selectedId === null) {
      Alert.alert('Error', 'Seleccione un producto de la lista');
      return;
    }
    if (!validateForm()) return;
    setSaving(true);
    try {
      await updateProduct({
        id: selectedId,
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        stock: parseInt(stock, 10),
        descripcion: descripcion.trim() || null,
        precio: parseFloat(precio),
        disponibilidad_envio: disponibilidad_envio ? 1 : 0,
      });
      clearForm();
      await loadProducts();
      Alert.alert('Éxito', 'Producto modificado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al modificar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (selectedId === null) {
      Alert.alert('Error', 'Seleccione un producto de la lista');
      return;
    }
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
              await deleteProduct(selectedId);
              clearForm();
              await loadProducts();
              Alert.alert('Éxito', 'Producto eliminado correctamente');
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

  const renderItem = ({ item }: { item: Product }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[styles.productItem, isSelected && styles.selectedItem]}
        onPress={() => selectProduct(item)}
      >
        <Text style={styles.productCode}>{item.codigo}</Text>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productDetail}>
          Stock: {item.stock} | Precio: ${item.precio.toFixed(2)}
        </Text>
        <Text style={styles.productDetail}>
          Envío: {item.disponibilidad_envio === 1 ? 'Disponible' : 'No disponible'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Formulario de Producto</Text>

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

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.createButton]}
          onPress={handleCreate}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.updateButton]}
          onPress={handleUpdate}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Modificar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={clearForm}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      {saving && <ActivityIndicator size="small" color="#4A90D9" style={styles.savingLoader} />}

      <Text style={styles.sectionTitle}>Lista de Productos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4A90D9" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay productos registrados</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
    color: '#333',
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  halfInput: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#34C759',
  },
  updateButton: {
    backgroundColor: '#4A90D9',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  clearButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  savingLoader: {
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedItem: {
    borderColor: '#4A90D9',
    borderWidth: 2,
    backgroundColor: '#EBF3FD',
  },
  productCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productName: {
    fontSize: 16,
    color: '#555',
    marginTop: 2,
  },
  productDetail: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 14,
  },
});
