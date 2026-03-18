# MacroView


MacroView is a mobile app built with Expo + React Native that helps you identify food ingredients and inspect their nutrition profile.

It supports two discovery paths:
1. Manual ingredient search.
2. Camera-based image labeling using an on-device TensorFlow Lite model.

When an ingredient is selected, MacroView fetches nutrition data from Spoonacular and lets users save ingredient details to a local SQLite database.
## Project Context

This project was completed as the final project for a mobile programming course at Haaga-Helia University of Applied Sciences.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Run](#setup-and-run)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database Schema](#database-schema)
- [Permissions and Native Notes](#permissions-and-native-notes)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

## Features

- Search ingredients by name.
- Detect likely ingredient labels from camera frames with MobileNet TFLite.
- View nutrition facts in a label-style detail screen.
- Save ingredients locally for offline revisit.
- Delete saved items from local storage.
- Navigate with a bottom-tab flow (Home, Search, Camera).

## Tech Stack

- Framework: Expo SDK 54, React Native 0.81, React 19
- Language: TypeScript + JavaScript
- Navigation: React Navigation (Bottom Tabs + Native Stack)
- Local storage: Expo SQLite
- Camera: react-native-vision-camera
- On-device ML: react-native-fast-tflite + MobileNet model asset
- Image preprocessing: vision-camera-resize-plugin
- Ingredient data API: Spoonacular

## How It Works

### 1. App Initialization

- App opens SQLite database `ingredientdb`.
- Tables are created if they do not exist.
- Navigation tree is mounted after DB initialization.

### 2. Search Flow

- User enters query in Search tab.
- App calls Spoonacular ingredient search endpoint.
- Results are rendered as cards.
- Tapping a card opens details in DataScreen.

### 3. Camera Flow

- Camera tab runs a frame processor at 1 FPS.
- Each frame is resized to `224x224` float32 RGB.
- MobileNet model predicts best class label.
- Predicted label can be sent directly to SearchScreen.

### 4. Data and Save Flow

- DataScreen resolves ingredient details from local DB or Spoonacular.
- Nutrition data is shown through the `FoodLabel` component.
- If not already saved locally, user can save item to SQLite.

## Project Structure

```text
MacroView/
	App.js                       # Navigation + DB bootstrap
	app.json                     # Expo config, permissions, plugins
	assets/
		mobilenet.tflite           # TFLite model used by camera inference
		imagenet_labels.json       # Label mapping for model output
	src/
		components/
			foodLabel.tsx            # Nutrition facts UI
			ingredientCard.tsx       # Search/home list card
			searchBar.tsx            # Search input component
		screens/
			HomeScreen.tsx           # Saved ingredients list
			SearchScreen.tsx         # API-based ingredient search
			CameraScreen.tsx         # Camera + model inference
			DataScreen.tsx           # Ingredient detail and save flow
		utils/
			utils.ts                 # API + model helper functions
			schema.ts                # SQLite schema and DB operations
```

## Prerequisites

Install these before running the project:

- Node.js 18+ (LTS recommended)
- npm (bundled with Node.js)
- Java JDK (version compatible with current Expo/Gradle setup)
- A Spoonacular API key

## Setup and Run

1. Install dependencies:

```bash
npm install
```

2. Create environment file in project root:

```bash
# .env
EXPO_PUBLIC_API_KEY=your_spoonacular_api_key_here
```

3. Build and run on Android (recommended for this project due to native camera/ML modules):

```bash
npm run android
```

4. Start Metro for dev-client flow (if needed):

```bash
npm run start
```

Notes:
- Because this app uses native modules (`react-native-vision-camera`, `react-native-fast-tflite`), Expo Go may not be sufficient for all features.
- Use a development build (`expo run:android` / EAS dev build) for full camera + ML support.

## Environment Variables

Required variables:

- `EXPO_PUBLIC_API_KEY`: Spoonacular API key used for ingredient search and nutrition detail requests.

If this variable is missing or invalid, API requests will fail.

## Available Scripts

- `npm run start`: Start Expo development server
- `npm run android`: Build and run Android app
- `npm run ios`: Build and run iOS app
- `npm run web`: Run web target (UI-only compatibility varies for native camera/ML features)

## Database Schema

The app creates these SQLite tables:

1. `ingredient`
- `id` (PK)
- `name`
- `amount`
- `unitShort`
- `aisle`
- `image`
- `categoryPath` (JSON string)

2. `caloric_breakdown`
- `id` (PK)
- `ingredient_id` (FK -> ingredient.id)
- `percentProtein`
- `percentFat`
- `percentCarbs`

3. `nutrient`
- `id` (PK)
- `ingredient_id` (FK -> ingredient.id)
- `name`
- `amount`
- `unit`
- `percentOfDailyNeeds`

## Permissions and Native Notes

- Camera permission is declared in Expo config (`app.json`).
- The project includes `react-native-vision-camera` plugin configuration.
- Metro is configured to load `.tflite` model assets.
- Android build includes `react-native-fast-tflite` GPU library enablement.

## Troubleshooting

### API returns 401 or empty results

- Confirm `.env` contains valid `EXPO_PUBLIC_API_KEY`.
- Restart Metro after changing environment variables.
- Verify Spoonacular account quota is not exhausted.

### Camera does not start

- Ensure camera permission is granted on device/emulator.
- Run a native development build instead of Expo Go.
- Confirm Android emulator has camera support enabled.

### Model or labels not loading

- Ensure `assets/mobilenet.tflite` and `assets/imagenet_labels.json` exist.
- Confirm `metro.config.js` includes `tflite` in `assetExts`.

### Android build issues

- Run `npm install` again and retry build.
- Re-sync Android/Gradle dependencies from Android Studio if needed.
- Clean local build artifacts if Gradle cache is stale.

## Future Improvements

- Add automated tests for DB logic and API utilities.
- Improve camera prediction confidence filtering and result smoothing.
- Add pagination and query debouncing for large search result sets.
- Add favorites/tags and richer offline nutrition analytics.