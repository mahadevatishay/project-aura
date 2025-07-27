'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, Auth, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, query, onSnapshot, Firestore } from 'firebase/firestore';

// Global variables provided by the Canvas environment
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

// Define the data structure for a single daily entry
interface DailyEntry {
  date: string;
  mood: number;
  activities: string[];
}

// Define the shape of our context state
interface DataContextType {
  entries: DailyEntry[];
  addEntry: (newEntry: DailyEntry) => void;
  getInsights: () => string;
  userId: string | null; // Expose userId for display
  isAuthReady: boolean; // Indicate when auth is initialized
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  console.log('DataProvider: Rendering'); // DEBUG LOG

  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  
  // FIX: Initialize entries to empty array, read from Firestore in useEffect
  const [entries, setEntries] = useState<DailyEntry[]>([]); 
  console.log('DataProvider: entries useState initialized to empty array'); // DEBUG LOG


  // 1. Initialize Firebase and Authenticate
  useEffect(() => {
    console.log('DataProvider: useEffect - initFirebase called'); // DEBUG LOG
    const initFirebase = async () => {
      try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined'
          ? JSON.parse(__firebase_config)
          : {};

        if (!Object.keys(firebaseConfig).length) {
          console.error("Firebase config not found. Please ensure __firebase_config is set.");
          setIsAuthReady(true);
          return;
        }

        const firebaseApp = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(firebaseApp);
        const firebaseAuth = getAuth(firebaseApp);

        setApp(firebaseApp);
        setDb(firestoreDb);
        setAuth(firebaseAuth);

        onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            setUserId(user.uid);
            console.log("Firebase Auth: User signed in:", user.uid);
          } else {
            console.log("Firebase Auth: No user signed in. Attempting anonymous sign-in.");
            try {
              if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(firebaseAuth, __initial_auth_token);
                console.log("Firebase Auth: Signed in with custom token.");
              } else {
                await signInAnonymously(firebaseAuth);
                console.log("Firebase Auth: Signed in anonymously.");
              }
            } catch (authError) {
              console.error("Firebase Auth Error during sign-in:", authError);
              setUserId(crypto.randomUUID());
            }
          }
          setIsAuthReady(true);
        });

      } catch (error) {
        console.error("Firebase initialization error:", error);
        setUserId(crypto.randomUUID());
        setIsAuthReady(true);
      }
    };

    initFirebase();
  }, []);

  // 2. Fetch/Listen to Data from Firestore
  useEffect(() => {
    console.log('DataProvider: useEffect - Firestore listener setup called. DB:', !!db, 'UserID:', !!userId, 'AuthReady:', isAuthReady); // DEBUG LOG
    if (!db || !userId || !isAuthReady) {
      return;
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const userEntriesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/entries`);
    const q = query(userEntriesCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries: DailyEntry[] = [];
      snapshot.forEach((doc) => {
        fetchedEntries.push(doc.data() as DailyEntry);
      });
      fetchedEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEntries(fetchedEntries);
      console.log("Firestore data updated:", fetchedEntries);
    }, (error) => {
      console.error("Error fetching Firestore data:", error);
    });

    return () => {
      console.log("Unsubscribing from Firestore listener.");
      unsubscribe();
    };
  }, [db, userId, isAuthReady]);

  const addEntry = async (newEntry: DailyEntry) => {
    console.log('DataProvider: addEntry called'); // DEBUG LOG
    if (!db || !userId) {
      console.error("Firestore DB or userId not available. Cannot add entry.");
      return;
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const entryDocRef = doc(db, `artifacts/${appId}/users/${userId}/entries`, newEntry.date);

    try {
      await setDoc(entryDocRef, newEntry, { merge: true });
      console.log("Entry added/updated in Firestore:", newEntry.date);
    } catch (error) {
      console.error("Error adding/updating entry to Firestore:", error);
    }
  };

  const getInsights = (): string => {
    // ... (insight logic, no changes needed here for debug)
    if (entries.length < 3) {
      return "Log a few more days to get personalized insights!";
    }
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const lastSevenEntries = sortedEntries.slice(-7);
    const lastThreeEntries = sortedEntries.slice(-3);
    const lowMoodThreshold = 4;
    const consecutiveLowMoodDays = lastSevenEntries.filter(entry => entry.mood <= lowMoodThreshold);
    if (consecutiveLowMoodDays.length >= 3) {
      return "Your mood has been consistently low recently. Consider reaching out to a friend, taking a mindful break, or engaging in a relaxing activity.";
    }
    if (lastThreeEntries.length === 3) {
      const moodToday = lastThreeEntries[2].mood;
      const moodYesterday = lastThreeEntries[1].mood;
      const moodDayBefore = lastThreeEntries[0].mood;
      if (moodToday < moodYesterday && moodYesterday < moodDayBefore && moodToday <= 5) {
        return "Your mood seems to be consistently dropping over the last few days. It might be a good time to reflect, or try something new to lift your spirits!";
      }
    }
    const activityImpact: { [key: string]: { highMoodCount: number; totalCount: number; averageMood: number; moodSum: number } } = {};
    entries.forEach(entry => {
      entry.activities.forEach(activity => {
        const trimmedActivity = activity.trim().toLowerCase();
        if (trimmedActivity) {
          if (!activityImpact[trimmedActivity]) {
            activityImpact[trimmedActivity] = { highMoodCount: 0, totalCount: 0, averageMood: 0, moodSum: 0 };
          }
          activityImpact[trimmedActivity].totalCount++;
          activityImpact[trimmedActivity].moodSum += entry.mood;
          if (entry.mood > 7) {
            activityImpact[trimmedActivity].highMoodCount++;
          }
        }
      });
    });
    for (const activity in activityImpact) {
      const stats = activityImpact[activity];
      if (stats.totalCount >= 2) {
        stats.averageMood = stats.moodSum / stats.totalCount;
        if (stats.averageMood >= 7.5 && stats.highMoodCount / stats.totalCount >= 0.75) {
          return `It seems "${activity}" consistently boosts your mood! Try to incorporate more of it into your routine.`;
        }
      }
    }
    if (lastSevenEntries.length === 7) {
      const avgActivitiesPerDay = lastSevenEntries.reduce((sum, entry) => sum + entry.activities.length, 0) / 7;
      if (avgActivitiesPerDay >= 4) {
        return "You've been incredibly productive lately! Remember to also schedule some well-deserved rest and relaxation.";
      }
    }
    const recentActivitiesCount = lastSevenEntries.reduce((sum, entry) => sum + entry.activities.length, 0);
    if (lastSevenEntries.length >= 5 && recentActivitiesCount < 5) {
      return "You've logged fewer activities recently. Perhaps try setting one small, achievable goal for today to get started!";
    }
    if (entries.length >= 7) {
      const allActivities = new Set<string>();
      entries.forEach(entry => entry.activities.forEach(activity => allActivities.add(activity.trim().toLowerCase())));
      if (allActivities.size < 5) {
        return "You seem to stick to a few core activities. How about trying something new this week to see how it impacts your mood?";
      }
    }
    return "Keep logging your days! Consistent data helps us provide better insights.";
  };

  const value = {
    entries,
    addEntry,
    getInsights,
    userId,
    isAuthReady,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
