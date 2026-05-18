import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity } from '../redux/slices/cartSlice';

const RestaurantDetailsScreen = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [itemQuantities, setItemQuantities] = useState({});

  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [restaurantId]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await fetch(`http://your-backend-url/api/restaurants/${restaurantId}`);
      const data = await response.json();
      setRestaurant(data.restaurant);
      setMenu(data.menu || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    const quantity = itemQuantities[item.id] || 1;
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      restaurant_id: restaurantId,
      quantity,
      image_url: item.image_url,
      description: item.description
    }));

    // Reset quantity
    setItemQuantities(prev => ({
      ...prev,
      [item.id]: 0
    }));
  };

  const handleQuantityChange = (itemId, change) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const filteredMenu = selectedCategory === 'all'
    ? menu
    : menu.filter(item => item.category === selectedCategory);

  const categories = ['all', ...new Set(menu.map(item => item.category))];

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Restaurant Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: restaurant?.image_url || 'https://via.placeholder.com/400' }}
            style={styles.headerImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View style={styles.infoSection}>
          <Text style={styles.restaurantName}>{restaurant?.name}</Text>
          <Text style={styles.cuisine}>{restaurant?.cuisine}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.ratingBox}>
              <Text style={styles.rating}>⭐ {restaurant?.average_rating?.toFixed(1) || '4.5'}</Text>
              <Text style={styles.ratingLabel}>Rating</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.rating}>🚚 {restaurant?.delivery_time}</Text>
              <Text style={styles.ratingLabel}>Minutes</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.rating}>📍 {restaurant?.distance || '2.5'}</Text>
              <Text style={styles.ratingLabel}>Km away</Text>
            </View>
          </View>

          <Text style={styles.description}>{restaurant?.description}</Text>

          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>📍 Address</Text>
            <Text style={styles.address}>{restaurant?.address}</Text>
            <Text style={styles.phone}>☎️ {restaurant?.phone}</Text>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {filteredMenu.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Image
                  source={{ uri: item.image_url || 'https://via.placeholder.com/80' }}
                  style={styles.menuItemImage}
                />
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                  <Text style={styles.menuItemPrice}>Rs. {item.price}</Text>
                </View>
              </View>

              <View style={styles.quantityControl}>
                {itemQuantities[item.id] > 0 ? (
                  <View style={styles.quantityButtons}>
                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => handleQuantityChange(item.id, -1)}
                    >
                      <Text style={styles.quantityBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{itemQuantities[item.id]}</Text>
                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => handleQuantityChange(item.id, 1)}
                    >
                      <Text style={styles.quantityBtnText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleAddToCart(item)}
                    >
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addButtonLarge}
                    onPress={() => {
                      setItemQuantities(prev => ({
                        ...prev,
                        [item.id]: 1
                      }));
                    }}
                  >
                    <Text style={styles.addButtonText}>+ Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Cart Button */}
      {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartButtonText}>
            🛒 View Cart ({cartItems.length}) - Proceed
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    position: 'relative',
    height: 250
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButtonText: {
    fontSize: 18,
    color: '#FF6B6B'
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#fff'
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5
  },
  cuisine: {
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 15
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10
  },
  ratingBox: {
    alignItems: 'center'
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  ratingLabel: {
    fontSize: 11,
    color: '#999'
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15
  },
  addressBox: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B'
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  address: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8
  },
  phone: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '600'
  },
  categorySection: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  categoryScroll: {
    paddingHorizontal: 20
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B6B'
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666'
  },
  categoryButtonTextActive: {
    color: '#fff'
  },
  menuSection: {
    padding: 20,
    paddingBottom: 100
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  menuItemContent: {
    flexDirection: 'row',
    flex: 1
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#f0f0f0'
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: 'space-between'
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
    lineHeight: 16
  },
  menuItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B6B'
  },
  quantityControl: {
    marginLeft: 10
  },
  addButtonLarge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden'
  },
  quantityBtn: {
    padding: 5,
    paddingHorizontal: 8
  },
  quantityBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  quantityText: {
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: '600'
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 5
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12
  },
  cartButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    padding: 15,
    paddingBottom: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  }
});

export default RestaurantDetailsScreen;
