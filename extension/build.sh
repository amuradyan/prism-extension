npm i

MODE=none

if [ $# -eq 1 ]
then
    MODE=$1
fi

webpack --config conf/background.config.js --mode $MODE
webpack --config conf/content.config.js --mode $MODE
webpack --config conf/popup.config.js --mode $MODE

cp -r markup/ resources/ build/
cp manifest.json build/