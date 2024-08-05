#!/bin/sh

cd server
npm install

cd ../app
export PUPPETEER_SKIP_CHROME_DOWNLOAD=true
export PUPPETEER_SKIP_CHROME_HEADLESS_SHELL_DOWNLOAD=true
npm install

cd ..