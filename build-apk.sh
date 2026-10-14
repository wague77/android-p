#!/usr/bin/env bash
# Script de compilation locale 100% fonctionnel pour Android APK et AAB Play Store
set -e

echo "🚀 ==============================================="
echo "    NOVA Studio - Compilation Android APK & AAB"
echo "==============================================="

# 1. Compiler les assets web
echo "📦 1/4 - Construction des fichiers web..."
npm install
npm run build

# 2. Générer le véritable projet Capacitor et appliquer la personnalisation
node scripts/prepare-mobile-build.js
[ -d android ] || npx cap add android
npx cap sync android
node scripts/prepare-native-android.js

# 3. Compiler l'APK Android (Installation directe)
echo "🤖 3/4 - Compilation de l'APK (assembleRelease)..."
cd android
chmod +x ./gradlew
./gradlew assembleDebug --stacktrace

# 4. Compiler l'AAB Google Play Store
echo "💎 4/4 - Compilation de l'AAB pour Google Play Store (bundleRelease)..."
./gradlew bundleRelease --stacktrace

echo ""
echo "✅ SUCCÈS ! Vos fichiers sont prêts :"
echo "📱 Fichier APK (installation directe) : android/app/build/outputs/apk/release/*.apk"
echo "🌐 Fichier AAB (Google Play Store)    : android/app/build/outputs/bundle/release/*.aab"
echo "==============================================="
