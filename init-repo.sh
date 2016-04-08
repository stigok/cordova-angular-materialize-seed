#!/bin/bash
#
# Derived from work by DixonJ
# https://stackoverflow.com/users/417568/dixonj
# http://stackoverflow.com/a/19146656/90674
#

textReset=$(tput sgr0)
textGreen=$(tput setaf 2)
message_info () {
  echo "${textGreen}[my-app]${textReset} $1"
}

read -p "Is $(pwd) where the repo currently lives? (y/n)?" choice
case "$choice" in
  y|Y ) echo "aight, lets go";;
  n|N ) exit 1;;
  * ) exit 1;;
esac

message_info "Changing cwd to $(pwd)/cordova"
cd cordova

message_info "Creating dirs"
mkdir platforms
mkdir plugins
mkdir www

message_info "Adding platforms..."
cordova platform add android

message_info "Initial build"
cordova build android

message_info "Adding plugins..."
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-media-capture
cordova plugin add cordova-plugin-screen-orientation
cordova plugin add cordova-plugin-whitelist

message_info "Rebuild"
cordova build android
