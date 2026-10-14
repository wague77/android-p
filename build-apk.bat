@echo off
echo ===============================================
echo     NOVA Studio - Compilation Android APK ^& AAB
echo ===============================================

echo [1/4] Construction des fichiers web...
call npm install
if errorlevel 1 exit /b 1
call npm run build
if errorlevel 1 exit /b 1

echo [2/4] Preparation Capacitor...
node scripts/prepare-mobile-build.js
if errorlevel 1 exit /b 1
if not exist android call npx cap add android
if errorlevel 1 exit /b 1
call npx cap sync android
if errorlevel 1 exit /b 1
node scripts/prepare-native-android.js
if errorlevel 1 exit /b 1

echo [3/4] Compilation de l'APK autonome...
cd android
call gradlew.bat assembleDebug
if errorlevel 1 exit /b 1

echo [4/4] Compilation de l'AAB Google Play Store...
call gradlew.bat bundleRelease
if errorlevel 1 exit /b 1

echo.
echo ===============================================
echo SUCCES ! Vos fichiers sont prets :
echo APK : android\app\build\outputs\apk\release\
echo AAB : android\app\build\outputs\bundle\release\
echo ===============================================
pause
