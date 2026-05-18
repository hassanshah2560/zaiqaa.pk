import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Alert,
  Switch,
  Modal,
  TextInput
} from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchOrders();
    fetchBookings();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://your-backend-url/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUser(data.data);
      setEditedUser(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://your-backend-url/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://your-backend-url/api/room-bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBookings(data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const getToken = async () => {
    // Implement token retrieval from secure storage
    return '';
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://your-backend-url/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editedUser.name,
          email: editedUser.email,
          phone: editedUser.phone,
          address: editedUser.address
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        setShowEditModal(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          // Clear authentication token
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
          });
        }
      }
    ]);
  };

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity onPress={() => setShowEditModal(true)}>
            <Text style={styles.editButton}>✎ Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatar_url || 'https://via.placeholder.com/100'
              }}
              style={styles.avatar}
            />
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>✓</Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ 4.8 (45 ratings)</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📱 Phone</Text>
              <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Address</Text>
              <Text style={styles.infoValue}>{user?.address || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📧 Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orders.length}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Room Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Saved Addresses</Text>
          </View>
        </View>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
                <Text style={styles.viewAllButton}>View All</Text>
              </TouchableOpacity>
            </View>
            {orders.slice(0, 3).map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderRestaurant}>{order.restaurant?.name}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.orderStatus}>
                  <Text style={[
                    styles.orderStatusText,
                    { color: getStatusColor(order.status) }
                  ]}>
                    {order.status.toUpperCase()}
                  </Text>
                  <Text style={styles.orderAmount}>Rs. {order.total_amount}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Get order updates</Text>
            </View>
            <Switch
              value={showNotifications}
              onValueChange={setShowNotifications}
              trackColor={{ false: '#ddd', true: '#FFB3BA' }}
              thumbColor={showNotifications ? '#FF6B6B' : '#fff'}
            />
          </View>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>🔐 Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>❤️ My Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>🎟️ Promo Codes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>📋 Saved Addresses</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>🆘 Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>📱 About zaiqaa.pk</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.modalCloseButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Avatar Section */}
            <View style={styles.avatarEditSection}>
              <Image
                source={{
                  uri: editedUser?.avatar_url || 'https://via.placeholder.com/120'
                }}
                style={styles.avatarEdit}
              />
              <TouchableOpacity style={styles.changeAvatarButton}>
                <Text style={styles.changeAvatarButtonText}>📷 Change Photo</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={editedUser?.name}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, name: text })
                }
                placeholder="Enter your name"
              />

              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={editedUser?.email}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, email: text })
                }
                placeholder="Enter your email"
                editable={false}
              />

              <Text style={styles.formLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={editedUser?.phone}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, phone: text })
                }
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <Text style={styles.formLabel}>Address</Text>
              <TextInput
                style={[styles.textInput, styles.textInputLarge]}
                value={editedUser?.address}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, address: text })
                }
                placeholder="Enter your address"
                multiline
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333'
  },
  editButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B'
  },
  profileCard: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0'
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700'
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8
  },
  ratingBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start'
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B'
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333'
  },
  viewAllButton: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B'
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginTop: 10
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  infoRow: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666'
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333'
  },
  statsSection: {
    flexDirection: 'row',
    padding: 20,
    gap: 15
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 5
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center'
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10
  },
  orderInfo: {
    flex: 1
  },
  orderRestaurant: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  orderDate: {
    fontSize: 12,
    color: '#999'
  },
  orderStatus: {
    alignItems: 'flex-end'
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4
  },
  orderAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333'
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  settingDescription: {
    fontSize: 12,
    color: '#999'
  },
  settingButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  settingButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  logoutButton: {
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 15,
    backgroundColor: '#FFE0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B'
  },
  footer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 12,
    color: '#999'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalCloseButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333'
  },
  placeholder: {
    width: 50
  },
  modalContent: {
    flex: 1,
    padding: 20
  },
  avatarEditSection: {
    alignItems: 'center',
    marginBottom: 30
  },
  avatarEdit: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    marginBottom: 15
  },
  changeAvatarButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8
  },
  changeAvatarButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333'
  },
  formSection: {
    marginBottom: 20
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333'
  },
  textInputLarge: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
});

export default ProfileScreen;
