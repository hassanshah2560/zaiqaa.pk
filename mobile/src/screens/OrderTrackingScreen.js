import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { io } from 'socket.io-client';

const OrderTrackingScreen = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const socket = io('http://your-backend-url');

    // Listen for real-time location updates
    socket.on(`order:${orderId}:location`, (data) => {
      setDriverLocation({
        latitude: data.latitude,
        longitude: data.longitude
      });
    });

    // Listen for order status updates
    socket.on(`order:${orderId}:status`, (data) => {
      setOrder(prev => ({
        ...prev,
        status: data.status,
        estimated_arrival: data.estimated_arrival
      }));
    });

    fetchOrder();

    return () => socket.disconnect();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      // Fetch order details from backend
      const response = await fetch(`http://your-backend-url/api/orders/${orderId}`);
      const data = await response.json();
      setOrder(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  const userLocation = {
    latitude: order?.delivery_address?.latitude || 31.5497,
    longitude: order?.delivery_address?.longitude || 74.3436
  };

  const restaurantLocation = {
    latitude: order?.restaurant?.latitude || 31.5204,
    longitude: order?.restaurant?.longitude || 74.3587
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (userLocation.latitude + restaurantLocation.latitude) / 2,
          longitude: (userLocation.longitude + restaurantLocation.longitude) / 2,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        }}
        onMapReady={() => setMapReady(true)}
      >
        {/* Restaurant Marker */}
        <Marker
          coordinate={restaurantLocation}
          title={order?.restaurant?.name}
          description="Restaurant"
          pinColor="#FF6B6B"
        />

        {/* Driver/Delivery Location */}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Your Delivery"
            description={`${order?.driver?.name || 'Driver'}`}
            pinColor="#4CAF50"
          />
        )}

        {/* User Location */}
        <Marker
          coordinate={userLocation}
          title="Delivery Address"
          description={order?.delivery_address?.address}
          pinColor="#2196F3"
        />

        {/* Route Line */}
        {driverLocation && (
          <Polyline
            coordinates={[
              restaurantLocation,
              driverLocation,
              userLocation
            ]}
            strokeColor="#FF6B6B"
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Order Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.orderId}>Order #{order?.id}</Text>
          <Text style={[styles.status, { color: getStatusColor(order?.status) }]}>
            {getStatusText(order?.status)}
          </Text>
        </View>

        <View style={styles.statusDetails}>
          <View style={styles.detail}>
            <Text style={styles.label}>Delivery Time</Text>
            <Text style={styles.value}>{order?.estimated_arrival || 'Calculating...'}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.label}>Driver</Text>
            <Text style={styles.value}>{order?.driver?.name || 'Assigning...'}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.label}>Total Amount</Text>
            <Text style={styles.value}>Rs. {order?.total_amount}</Text>
          </View>
        </View>

        {/* Status Timeline */}
        <View style={styles.timeline}>
          {[
            { label: 'Order Placed', status: 'pending' },
            { label: 'Preparing', status: 'preparing' },
            { label: 'Out for Delivery', status: 'delivering' },
            { label: 'Delivered', status: 'delivered' }
          ].map((step, index) => (
            <View key={index} style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineCircle,
                  {
                    backgroundColor: isStatusCompleted(order?.status, step.status)
                      ? '#4CAF50'
                      : '#E0E0E0'
                  }
                ]}
              >
                <Text style={styles.timelineNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.timelineLabel}>{step.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const getStatusColor = (status) => {
  const colors = {
    pending: '#FFA500',
    preparing: '#FF6B6B',
    delivering: '#2196F3',
    delivered: '#4CAF50'
  };
  return colors[status] || '#666';
};

const getStatusText = (status) => {
  const texts = {
    pending: 'Order Confirmed',
    preparing: 'Preparing Your Order',
    delivering: 'Out for Delivery',
    delivered: 'Delivered'
  };
  return texts[status] || 'Processing';
};

const isStatusCompleted = (currentStatus, checkStatus) => {
  const statusOrder = ['pending', 'preparing', 'delivering', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const checkIndex = statusOrder.indexOf(checkStatus);
  return checkIndex <= currentIndex;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  map: {
    flex: 0.6,
    width: '100%'
  },
  statusCard: {
    flex: 0.4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  status: {
    fontSize: 14,
    fontWeight: '600'
  },
  statusDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  detail: {
    alignItems: 'center'
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  timelineItem: {
    alignItems: 'center',
    flex: 1
  },
  timelineCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  timelineNumber: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12
  },
  timelineLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center'
  }
});

export default OrderTrackingScreen;
