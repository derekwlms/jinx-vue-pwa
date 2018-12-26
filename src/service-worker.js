/**
 * Slightly customized version of the Workbox service worker.
 *
 * HTTP caching is disabled for this file - see firebase.json and https://goo.gl/nhQhGp
 *
 * This code is based on Workbox's auto-generated service-worker.js (generateSW).
 * With each new build, update the precache-manifest name.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/* Update this for each new build. Hopefully newer vue-cli and/or Workbox updates
 * will give more flexibility with generateSW (without having to drop to injectManifest).
 */

importScripts(
  "/precache-manifest.0da1c98456f1830e91cd7a389e06b559.js"
);

workbox.core.setCacheNameDetails({prefix: "jinx-vue-pwa"});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.addEventListener("message", function(msg) {
  if (msg.data.action == 'skipWaiting') {
    self.skipWaiting();
  }
});