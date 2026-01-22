# TussiesJack Mobile - Complete Setup Guide

## 🎯 Oversikt
Dette er en **komplett AI-Powered Blackjack mobilapp** som kjøres lokalt med:
- On-device AI (TensorFlow Lite)
- Firebase for statistikk
- Genkit for coaching (opcional sky-fallback)

## 📋 Steg 1: Forutsetninger

### Installer på datamaskinen din:
```bash
# Node.js (v18+)
node --version

# npm eller yarn
npm --version

# Expo CLI (for React Native testing)
npm install -g expo-cli

# Android Studio (for emulator) ELLER Xcode (for iOS)
```

## 🚀 Steg 2: Sett opp prosjektet lokalt

### Klone og installér
```bash
# Klone repo
git clone https://github.com/tussienorway/tussiesjack.git
cd tussiesjack/mobile

# Installer dependencies
npm install
# eller
yarn install
```

### Opprett .env fil
```
# mobile/.env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## 🔥 Steg 3: Firebase Setup

### A. Opprett Firebase prosjekt
1. Gå til [Firebase Console](https://console.firebase.google.com)
2. Klikk "Create New Project"
3. Navn: `tussiesjack-mobile`
4. Avslå Google Analytics (optional)

### B. Legg til Android/iOS app
1. I Firebase: Klikk "+Add app" og velg Android eller iOS
2. Last ned `google-services.json` (Android) eller `GoogleService-Info.plist` (iOS)
3. Plasser filen i riktig folder:
   - **Android**: `android/app/`
   - **iOS**: `ios/`

### C. Opprett Firestore database
1. I Firebase Console: Database -> Create Database
2. Start in **Production Mode**
3. Region: `europe-west1` (for lav latency fra Norge)
4. Lag denne Firestore-strukturen:

```
/users/{userId}
  /stats
    wins: 0
    losses: 0
    lastUpdated: timestamp

/games/{gameId}
  playerId: string
  hands: [{player_hand, dealer_hand, action, result}]
  timestamp: timestamp
```

## 🎮 Steg 4: Kjør appen lokalt

### Start dev server
```bash
cd mobile
npm start
```

### Kjør på Android emulator
```bash
# Åpne Android emulator først
# Deretter: Press 'a' i Expo CLI
npm run android
```

### Kjør på iOS simulator
```bash
npm run ios
```

### Kjør på fysisk telefon
```bash
# Installer Expo Go app på telefonen
# Scan QR-koden som dukker opp
npm start
```

## 📱 Steg 5: Filstruktur du må kopiere

Kopier disse filene fra GitHub til din lokale `mobile/` mappe:

```
mobile/
├── App.tsx                          # Main app component
├── package.json                     # Dependencies
├── app.json                         # Expo config
├── src/
│   ├── game/
│   │   ├── blackjackEngine.ts       # Game logic
│   │   └── aiAgent.ts               # AI strategy
│   ├── components/
│   │   ├── GameBoard.tsx            # UI
│   │   └── Stats.tsx                # Stats display
│   └── firebase/
│       └── config.ts                # Firebase init
├── android/
│   └── app/
│       └── google-services.json     # Firebase config
└── ios/
    └── GoogleService-Info.plist     # Firebase config
```

## 🤖 Steg 6: AI Agent (On-Device)

AI-en bruker en enkel strategi-modell som kjører på enheten:

```typescript
// Den integrerte AI-agenten gir råd basert på:
// 1. Din hånd (sum av kort)
// 2. Dealers åpne kort
// 3. Klassisk blackjack-strategi
```

## ☁️ Steg 7: Genkit Backend (Optional Cloud)

### Deploy coaching-server på Cloud Run

```bash
# Opprett backend-folder
mkdir backend
cd backend

# Initialiser Node.js prosjekt
npm init -y
npm install @genkit-ai/core @genkit-ai/googleai @genkit-ai/firebase

# Opprett genkit.ts med coaching flows
```

### Deploy til Cloud Run
```bash
cd backend
gcloud run deploy tussiesjack-coach --source . --region europe-west1
```

## 📊 Steg 8: Test appen

### Sjekkliste:
- [ ] App starter uten feil
- [ ] "Deal" knapp fungerer
- [ ] Hit/Stand logikk virker
- [ ] Statistikk lagres lokalt
- [ ] Firebase data dukker opp i Console
- [ ] Du kan spille minimum 10 hender

## 🔧 Troubleshooting

### Feil: "Firebase config is not defined"
```bash
# Sjekk at .env fil eksisterer
cat .env

# Re-install dependencies
rm -rf node_modules
npm install
```

### Feil: "TensorFlow Lite not found"
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native
```

### Android emulator starter ikke
```bash
# Åpne Android Studio
# AVD Manager -> Lag ny emulator
# Velg "Pixel 5" og "API 33"
```

## 📦 Production Deployment

### Build Android APK
```bash
cd mobile
npm run build:android
# APK ligger i: android/app/build/outputs/apk/release/
```

### Build iOS IPA
```bash
cd mobile
npm run build:ios
# Bruk Xcode Archive & Export
```

## 🎓 Lær mer

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Firebase React Native](https://rnfirebase.io)
- [TensorFlow Lite for Mobile](https://www.tensorflow.org/lite/guide)

---

**Status**: ✅ Komplett! Du kan nå spille blackjack lokalt med AI-agent.
