import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';

// Mock data for the services you offer
const SERVICES = [
  { id: '1', title: 'Formal Event Companion', price: '$50/hr' },
  { id: '2', title: 'Study Buddy', price: '$30/hr' },
  { id: '3', title: 'Tour Guide', price: '$40/hr' },
];

export default function App() {
  const [selectedService, setSelectedService] = useState(); // error: should pass null

  const handleBooking = (title) => {
    Alert.alert("Booking Request", "You have requested: " + title + ". We will contact you soon!" // error: missing closing parenthesis
  };

  const renderItem = (item) => ( // error: should destructure { item }
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleBooking(item.name)} // error: item.name does not exist
    >
      <Text style={styles.serviceTitle}>{item.title}</Text>
      <Text style={styles.price}>{item.pricee}</Text> {/* error: pricee is a typo */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Service</Text>
      <FlatList
        data={SERVICES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedService} // okay, but let's leave it
      />
      <Text>This is extra text without closing tag // error
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: '1', // error: should be number, not string
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: '24px', // error: should be number, not string
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: '3', // error: should be number, not string
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 600, // error: should be string
  },
  price: {
    color: '#2ecc71',
    marginTop: '5px', // error: should be number
    fontWeight: 'bold',
  },
});