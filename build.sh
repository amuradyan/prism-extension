set -e

npx webpack --config conf/background.config.js
npx webpack --config conf/content.config.js
npx webpack --config conf/popup.config.js

cp manifest.json build/
cp -r src/markup build/
cp -r resources/ build/