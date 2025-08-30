
KD's YT SEO — React Web App (Vite) + Capacitor wrapper helper scripts
===================================================================

This ZIP contains a complete React web app (Vite) with a simplified UI that replicates the YouTube SEO Optimizer UI.
It also includes a helper shell script to initialize Capacitor and create the Android project locally on your machine.

How to produce the Android Project & APK (on your machine)
----------------------------------------------------------
1. Install Node.js (>=16), npm, and Java + Android Studio.
2. Extract this ZIP and open a terminal in the project folder.
3. Install dependencies:
   npm install
4. Build the web assets:
   npm run build
5. Run the helper script to initialize Capacitor and add Android:
   chmod +x wrap_with_capacitor.sh
   ./wrap_with_capacitor.sh
   This will run:
     npx cap init "KD's YT SEO" com.kd.ytseo --web-dir=build --npm-client=npm
     npx cap add android
     npx cap copy
   (If npx cap init prompts, the script uses the flags to be non-interactive.)
6. Open the Android project in Android Studio:
   npx cap open android
7. In Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)
   The generated APK will be in: android/app/build/outputs/apk/debug/app-debug.apk

Notes & Troubleshooting
-----------------------
- The UI uses simplified local stub components. You can replace them with your preferred component library.
- To publish on Play Store, create a keystore and build a release AAB via Gradle in Android Studio.
- Keep your keystore safe.
