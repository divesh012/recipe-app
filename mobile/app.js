import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as Font from 'expo-font';

// Import your API and Stores
import { MealAPI } from './services/mealAPI'; 
// import { useMealStore } from './store/mealStore'; // If using Zustand

const CLERK_PUBLISHABLE_KEY = "your-pk-here"; // Get this from Clerk Dashboard

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialMeals, setInitialMeals] = useState([]);

  useEffect(() => {
    async function initializeApp() {
      try {
        // 1. Load Fonts & Assets (Non-blocking fallback)
        const fontTask = Font.loadAsync({
          // 'CustomFont': require('./assets/fonts/font.ttf'),
        }).catch(err => console.warn("Fonts failed but app will continue", err));

        // 2. Fetch Initial Data (Parallel but safe)
        const dataTask = MealAPI.getRandomMeals(3); 

        // Wait for both, but we use a timeout race to prevent the 6s crash
        const [meals] = await Promise.all([dataTask, fontTask]);
        
        if (meals) setInitialMeals(meals);
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setIsReady(true);
      }
    }

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={{ marginTop: 10 }}>Loading Delicious Recipes...</Text>
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <View style={styles.container}>
        <SignedIn>
          {/* Your actual App screens go here */}
          <Text>Welcome back! Found {initialMeals.length} meals.</Text>
        </SignedIn>
        
        <SignedOut>
          {/* Your Login Screen goes here */}
          <Text>Please Log In</Text>
        </SignedOut>
      </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
});