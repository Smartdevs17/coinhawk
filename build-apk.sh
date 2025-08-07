#!/bin/bash
# build-apk.sh - Automated APK builder for BaseGecko

echo "🦅 Building BaseGecko APK for distribution..."

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf android/app/build/outputs/apk/
rm -f *.apk

# Step 2: Export the bundle first
echo "📦 Exporting JavaScript bundle..."
npx expo export --platform android

# Step 3: Build the APK
echo "🔨 Building standalone APK..."
npx expo run:android --variant release

# Step 3: Check if build was successful
if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ Build successful!"
    
    # Step 4: Copy APK with descriptive name
    TIMESTAMP=$(date +"%Y%m%d_%H%M")
    cp android/app/build/outputs/apk/release/app-release.apk "./BaseGecko_v${TIMESTAMP}.apk"
    
    # Step 5: Show APK info
    echo "📱 APK created: BaseGecko_v${TIMESTAMP}.apk"
    echo "📊 APK size: $(ls -lh BaseGecko_v${TIMESTAMP}.apk | awk '{print $5}')"
    echo "📍 Location: $(pwd)/BaseGecko_v${TIMESTAMP}.apk"
    
    # Step 6: Verify APK
    echo "🔍 Verifying APK..."
    if command -v aapt &> /dev/null; then
        aapt dump badging "BaseGecko_v${TIMESTAMP}.apk" | grep -E "package|application-label"
    fi
    
    echo "🎉 Ready to share! Send BaseGecko_v${TIMESTAMP}.apk to your testers."
    
else
    echo "❌ Build failed! Check the output above for errors."
    exit 1
fi