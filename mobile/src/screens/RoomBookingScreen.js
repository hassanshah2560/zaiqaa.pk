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
  FlatList,
  Modal
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const RoomBookingScreen = ({ route, navigation }) => {
  const { restaurantId, restaurantName } = route.params;
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [guests, setGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [restaurantId]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(
        `http://your-backend-url/api/rooms?restaurant_id=${restaurantId}`
      );
      const data = await response.json();
      setRooms(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      Alert.alert('Error', 'Failed to load rooms');
      setLoading(false);
    }
  };

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (event, time) => {
    if (time) {
      setSelectedTime(time);
    }
    setShowTimePicker(false);
  };

  const handleBookRoom = async () => {
    if (!selectedRoom) {
      Alert.alert('Error', 'Please select a room');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await fetch('http://your-backend-url/api/room-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`
        },
        body: JSON.stringify({
          room_id: selectedRoom.id,
          restaurant_id: restaurantId,
          booking_date: selectedDate.toISOString().split('T')[0],
          booking_time: selectedTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          number_of_guests: guests,
          special_requests: ''
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Room booked successfully!');
        setShowConfirmModal(false);
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        Alert.alert('Error', data.error || 'Failed to book room');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to book room');
      console.error('Error booking room:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  const getToken = async () => {
    // Implement token retrieval from secure storage
    return '';
  };

  const RoomCard = ({ room, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.roomCard, isSelected && styles.roomCardSelected]}
      onPress={onPress}
    >
      <Image
        source={{ uri: room.image_url || 'https://via.placeholder.com/150' }}
        style={styles.roomImage}
      />
      <View style={styles.roomContent}>
        <Text style={styles.roomName}>{room.name}</Text>
        <View style={styles.roomMeta}>
          <Text style={styles.roomMetaText}>👥 {room.capacity} guests</Text>
          <Text style={styles.roomMetaText}>📐 {room.area} sq.ft</Text>
        </View>
        <Text style={styles.roomDescription}>{room.description}</Text>
        <View style={styles.amenities}>
          {room.amenities?.slice(0, 3).map((amenity, index) => (
            <Text key={index} style={styles.amenity}>
              {amenity}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>Rs. {room.price_per_hour}</Text>
        <Text style={styles.priceLabel}>/hour</Text>
        {isSelected && (
          <View style={styles.selectedCheckmark}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a Room</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
          <Text style={styles.restaurantSubtitle}>Select a room for your event</Text>
        </View>

        {/* Date & Time Selection */}
        <View style={styles.dateTimeSection}>
          <View style={styles.dateTimeCard}>
            <Text style={styles.dateTimeLabel}>📅 Date</Text>
            <TouchableOpacity
              style={styles.dateTimeInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateTimeValue}>
                {selectedDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeCard}>
            <Text style={styles.dateTimeLabel}>🕐 Time</Text>
            <TouchableOpacity
              style={styles.dateTimeInput}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateTimeValue}>
                {selectedTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Guests Selection */}
        <View style={styles.guestsSection}>
          <Text style={styles.guestsLabel}>👥 Number of Guests</Text>
          <View style={styles.guestsControl}>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => setGuests(Math.max(1, guests - 1))}
            >
              <Text style={styles.guestButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.guestCount}>{guests}</Text>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => setGuests(guests + 1)}
            >
              <Text style={styles.guestButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Available Rooms */}
        <View style={styles.roomsSection}>
          <Text style={styles.sectionTitle}>Available Rooms</Text>
          {rooms.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No rooms available</Text>
            </View>
          ) : (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                isSelected={selectedRoom?.id === room.id}
                onPress={() => setSelectedRoom(room)}
              />
            ))
          )}
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            !selectedRoom && styles.bookButtonDisabled
          ]}
          onPress={() => setShowConfirmModal(true)}
          disabled={!selectedRoom}
        >
          <Text style={styles.bookButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="spinner"
          onChange={handleTimeChange}
          is24Hour={false}
        />
      )}

      {/* Booking Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Booking</Text>
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Booking Summary */}
              <View style={styles.summarySection}>
                <Text style={styles.summaryTitle}>Booking Summary</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Room</Text>
                  <Text style={styles.summaryValue}>{selectedRoom?.name}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date</Text>
                  <Text style={styles.summaryValue}>
                    {selectedDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Time</Text>
                  <Text style={styles.summaryValue}>
                    {selectedTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Guests</Text>
                  <Text style={styles.summaryValue}>{guests}</Text>
                </View>

                <View style={[styles.summaryRow, styles.summaryRowBold]}>
                  <Text style={styles.summaryLabel}>Total</Text>
                  <Text style={styles.summaryPrice}>
                    Rs. {selectedRoom?.price_per_hour * 2}
                  </Text>
                </View>
              </View>

              {/* Payment Method */}
              <View style={styles.paymentSection}>
                <Text style={styles.paymentTitle}>Payment Method</Text>
                <View style={styles.paymentOption}>
                  <View style={styles.radioButton}>
                    <View style={styles.radioButtonFilled} />
                  </View>
                  <Text style={styles.paymentOptionText}>Cash on Arrival (COD)</Text>
                </View>
              </View>

              {/* Terms */}
              <View style={styles.termsSection}>
                <Text style={styles.termsText}>
                  ✓ Cancellation allowed up to 2 hours before booking
                </Text>
                <Text style={styles.termsText}>
                  ✓ Please arrive 15 minutes before your slot
                </Text>
              </View>
            </ScrollView>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  bookingLoading && styles.confirmButtonDisabled
                ]}
                onPress={handleBookRoom}
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
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
  backButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333'
  },
  placeholder: {
    width: 50
  },
  restaurantHeader: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5
  },
  restaurantSubtitle: {
    fontSize: 13,
    color: '#999'
  },
  dateTimeSection: {
    flexDirection: 'row',
    padding: 20,
    gap: 15
  },
  dateTimeCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15
  },
  dateTimeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8
  },
  dateTimeInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center'
  },
  dateTimeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  guestsSection: {
    paddingHorizontal: 20,
    marginBottom: 25
  },
  guestsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  guestsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 5
  },
  guestButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  guestButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  guestCount: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#333'
  },
  roomsSection: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15
  },
  roomCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    flexDirection: 'row'
  },
  roomCardSelected: {
    borderColor: '#FF6B6B',
    backgroundColor: '#fff'
  },
  roomImage: {
    width: 100,
    height: 140,
    backgroundColor: '#e0e0e0'
  },
  roomContent: {
    flex: 1,
    padding: 12
  },
  roomName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8
  },
  roomMeta: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 15
  },
  roomMetaText: {
    fontSize: 11,
    color: '#666'
  },
  roomDescription: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
    lineHeight: 16
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5
  },
  amenity: {
    fontSize: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    color: '#666',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  priceContainer: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0'
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B'
  },
  priceLabel: {
    fontSize: 10,
    color: '#999'
  },
  selectedCheckmark: {
    marginTop: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkmark: {
    color: '#fff',
    fontWeight: '700'
  },
  emptyState: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999'
  },
  bookButton: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bookButtonDisabled: {
    opacity: 0.5
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    flex: 1
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333'
  },
  modalClose: {
    fontSize: 24,
    color: '#666'
  },
  modalContent: {
    flex: 1,
    padding: 20
  },
  summarySection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  summaryRowBold: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 0
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500'
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333'
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B'
  },
  paymentSection: {
    marginBottom: 20
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioButtonFilled: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B6B'
  },
  paymentOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333'
  },
  termsSection: {
    backgroundColor: '#f0f8f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20
  },
  termsText: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 8,
    lineHeight: 18
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmButtonDisabled: {
    opacity: 0.6
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff'
  }
});

export default RoomBookingScreen;
