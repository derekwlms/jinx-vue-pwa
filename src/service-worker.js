/**
 * Slightly customized version of the Workbox service worker.
 *
 * HTTP caching is disabled for this file - see firebase.json and https://goo.gl/nhQhGp
 *
 * This code is based on Workbox's auto-generated service-worker.js (GenerateSW).
 * See https://goo.gl/2aRDsh and https://goo.gl/S9QRab.
 *
 * Vue cli-plugin-pwa will add the latest "importScripts" lines (on "npm run build").
 * 
 * eslint-disable no-undef
 */
/* eslint-disable no-undef */

// importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");
// importScripts(
//   "/precache-manifest.0da1c98456f1830e91cd7a389e06b559.js"
// );

workbox.core.setCacheNameDetails({prefix: "jinx-vue-pwa"});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.addEventListener("message", function(msg) {
  if (msg.data.action == 'skipWaiting') {
    self.skipWaiting();
  }
});