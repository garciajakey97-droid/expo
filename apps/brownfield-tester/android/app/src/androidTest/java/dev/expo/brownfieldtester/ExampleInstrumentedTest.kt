pacimport React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';

// Mock data for the services you offer
const SERVICES = [
  { id: '1', title: 'Formal Event Companion', price: '$50/hr' },
  { id: '2', title: 'Study Buddy', price: '$30/hr' },
  { id: '3', title: 'Tour Guide', price: '$40/hr' },
];

export default function App() {
  const [selectedService, setSelectedService] = useState(null);

  const handleBooking = (title) => {
    Alert.alert("Booking Request", `You have requested: ${title}. We will contact you soon!`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleBooking(item.title)}
    >
      <Text style={styles.serviceTitle}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Service</Text>
      <FlatList
        data={SERVICES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
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
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    : { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  price: {
    color: '#2ecc71',
    marginTop: 5,
    fontWeight: 'bold',
  },
});kage dev.expo.brownfieldtester

import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.ext.junit.runners.AndroidJUnit4

import org.junit.Test
import org.junit.runner.RunWith

import org.junit.Assert.*

/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(AndroidJUnit4::class)
class ExampleInstrumentedTest {
  @Test
  fun useAppContext() {
    // Context of the app under test.
    val appContext = InstrumentationRegistry.getInstrumentation().targetContext
    assertEquals("dev.expo.brownfieldtester", appContext.packageName)
  }
}
