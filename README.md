# Jinx! - Vue.js PWA Game

![Jinx!](public/images/icons/jinx-128x128.png)
> **<em>Can you say what I say?</em>**


## UNDER CONSTRUCTION

<em>Jinx!</em> is a simple chat-style game where two players work together to find the same word. It's inspired by 
[OK Go](https://okgo.net/2013/05/09/say-the-same-thing/)'s awesome 
[Say the Same Thing](http://www.shakingearthdigital.com/portfolio/say-the-same-thing/)
mobile [app](https://www.highroadtouring.com/check-out-ok-gos-new-free-game-app-say-the-same-thing/).

The [OK Go](https://okgo.net/2013/05/09/say-the-same-thing/) app is no longer available, 
so this is a "personal tech" replacement,
and a chance to try a Progressive Web App (PWA) with Vue.js.

---

## Running Locally

Pre-requisites: [git](https://git-scm.com/),  [node.js](https://nodejs.org), and [vue-cli](https://cli.vuejs.org/).

1. `git clone https://github.com/derekwlms/jinx-vue-pwa.git`
2. `cd jinx-vue-pwa && npm install && npm run serve`
3. [Open in your browser](http://localhost:8080)

## Development
```
npm run server     # run locally
npm run build      # build for distribution
npm run test       # run tests
npm run test:unit  # run unit tests
npm run test:e2e   # run end-to-end tests
npm run lint       # check for ugliness
```

See also the [Vue.js Configuration Reference](https://cli.vuejs.org/config/).

## Notes

- This project is licensed under [ISC](https://opensource.org/licenses/ISC) terms. See LICENSE.txt.
- See the [Firebase deployment](https://jinx-vue-pwa.firebaseapp.com) and additional notes on the [wiki](https://github.com/derekwlms/jinx-vue-pwa/wiki) and [gists](https://bitbucket.org/derekwlms/notes/src/master/jinx-vuew-pwa.MD).
- Lighthouse PWA report: `firebase deploy && lighthouse https://jinx-vue-pwa.firebaseapp.com --view`
 
## TODO
- [ ] Service worker - update app
- [ ] Add cache headers? ([firebase.json](https://github.com/derekwlms/kudos-ionic-pwa/blob/master/firebase.json))
- [ ] Do npm audit cleanup
- [ ] Add tests
- [ ] Security, player validations
- [ ] Host on GitHub Pages 
- [ ] Travis CI or Circle CI
