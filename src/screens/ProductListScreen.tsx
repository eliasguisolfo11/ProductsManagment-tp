import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Product } from '../types';
import { getAllProducts } from '../database/database';

type ProductListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductList'>;
};

export default function ProductListScreen({ navigation }: ProductListScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch {
      Alert.alert('Error', 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductForm', { product: item })}
    >
      <View style={styles.productHeader}>
        <Text style={styles.productCode}>{item.codigo}</Text>
      </View>
      <Text style={styles.productName}>{item.nombre}</Text>
      <Text style={styles.productDetail}>
        Stock: {item.stock} | Precio: ${item.precio.toFixed(2)}
      </Text>
      <Text style={styles.productDetail}>
        Envío: {item.disponibilidad_envio === 1 ? 'Disponible' : 'No disponible'}
        {item.descripcion ? ` | ${item.descripcion}` : ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ProductForm', {})}
      >
        <Text style={styles.addButtonText}>+ Nuevo Producto</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90D9" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={products.length === 0 ? styles.emptyContainer : undefined}
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
  addButton: {
    backgroundColor: '#34C759',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 40,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productCode: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4A90D9',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productDetail: {
    fontSize: 13,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 15,
  },
});
