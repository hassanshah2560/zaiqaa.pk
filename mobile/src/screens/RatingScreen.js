import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';

const RatingScreen = ({ route, navigation }) => {
  const { orderId, restaurantId, restaurantName, restaurantImage } = route.params;
  const [rating, setRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRating = async () => {
    if (rating === 0 || foodRating === 0 || deliveryRating === 0) {
      Alert.alert('Incomplete', 'Please provide all ratings');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://your-backend-url/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`
        },
        body: JSON.stringify({
          order_id: orderId,
          restaurant_id: restaurantId,
          overall_rating: rating,
          food_quality_rating: foodRating,
          delivery_rating: deliveryRating,
          review_text: review
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        Alert.alert('Error', data.error || 'Failed to submit rating');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit rating');
      console.error('Error submitting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const getToken = async () => {
    // Implement token retrieval from secure storage
    return '';
  };

  const StarRating = ({ value, onPress, label }) => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>{label}</Text>
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => onPress(star)}
              style={styles.starButton}
            >
              <Text style={[
                styles.star,
                { color: star <= value ? '#FFD700' : '#ddd' }
              ]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingValue}>
          {value > 0 ? `${value}.0 / 5.0` : 'Not rated'}
        </Text>
      </View>
    );
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successMessage}>
            Your rating helps us improve our service
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate Your Experience</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantCard}>
          <Image
            source={{ uri: restaurantImage || 'https://via.placeholder.com/80' }}
            style={styles.restaurantImage}
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurantName}</Text>
            <Text style={styles.orderText}>Order #{orderId}</Text>
          </View>
        </View>

        {/* Overall Rating */}
        <StarRating
          value={rating}
          onPress={setRating}
          label="Overall Experience"
        />

        {/* Food Quality Rating */}
        <StarRating
          value={foodRating}
          onPress={setFoodRating}
          label="Food Quality"
        />

        {/* Delivery Rating */}
        <StarRating
          value={deliveryRating}
          onPress={setDeliveryRating}
          label="Delivery Experience"
        />

        {/* Quick Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.tagsSectionTitle}>Share Your Feedback</Text>
          <View style={styles.tagsContainer}>
            {[
              'Delicious',
              'Hot Food',
              'Good Packaging',
              'Friendly Driver',
              'On Time',
              'Fresh'
            ].map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tag,
                  // Add logic to track selected tags
                ]}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Review Text */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Write a Review (Optional)</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your thoughts... (max 500 characters)"
            placeholderTextColor="#bbb"
            multiline
            maxLength={500}
            value={review}
            onChangeText={setReview}
          />
          <Text style={styles.characterCount}>{review.length}/500</Text>
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationSection}>
          <Text style={styles.recommendationLabel}>
            Would you recommend this restaurant?
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.recommendButton}>
              <Text style={styles.recommendButtonText}>👍 Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recommendButton}>
              <Text style={styles.recommendButtonText}>👎 No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recommendButton}>
              <Text style={styles.recommendButtonText}>🤷 Maybe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmitRating}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          )}
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.skipButtonText}>Skip for Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollView: {
    flex: 1,
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  closeButton: {
    padding: 8,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333'
  },
  placeholder: {
    width: 35
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30
  },
  restaurantImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15
  },
  restaurantInfo: {
    flex: 1
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5
  },
  orderText: {
    fontSize: 12,
    color: '#999'
  },
  ratingContainer: {
    marginBottom: 30
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 8
  },
  starButton: {
    marginRight: 8
  },
  star: {
    fontSize: 36,
    color: '#FFD700'
  },
  ratingValue: {
    fontSize: 12,
    color: '#999',
    marginTop: 5
  },
  tagsSection: {
    marginBottom: 30
  },
  tagsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginBottom: 8
  },
  tagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },
  reviewSection: {
    marginBottom: 30
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top'
  },
  characterCount: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
    textAlign: 'right'
  },
  recommendationSection: {
    marginBottom: 30
  },
  recommendationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10
  },
  recommendButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  recommendButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333'
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  submitButtonDisabled: {
    opacity: 0.6
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  skipButton: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  skipButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600'
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  successIcon: {
    fontSize: 60,
    color: '#4CAF50',
    marginBottom: 20
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  }
});

export default RatingScreen;
