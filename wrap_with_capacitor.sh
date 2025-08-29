
#!/usr/bin/env bash
set -e
echo "Installing Capacitor core & cli if missing..."
npm install @capacitor/core @capacitor/cli --no-audit --no-fund
echo "Initializing Capacitor (non-interactive)..."
npx cap init "KD's YT SEO" com.kd.ytseo --web-dir=build --npm-client=npm || true
echo "Adding Android platform..."
npx cap add android || true
echo "Copying web assets to native project..."
npx cap copy
echo "Done. You can now run: npx cap open android"
