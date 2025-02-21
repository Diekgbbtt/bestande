#!/bin/bash
npx tsc --build
npm run copy
NODE_ENV=production NODE_OPTIONS="--openssl-legacy-provider" REACT_APP_ONESIGNAL_APP_ID=$REACT_APP_ONESIGNAL_APP_ID REACT_APP_ONESIGNAL_SAFARI_WEB_ID=$REACT_APP_ONESIGNAL_SAFARI_WEB_ID npx webpack --config=web/webpack.config.js -p
