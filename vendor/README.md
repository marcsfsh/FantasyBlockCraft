# Vendored libraries

Third-party code committed so that builds never need the network.

| File | Library | Version | Source | License |
|---|---|---|---|---|
| `three.min.js` | three.js | r128 (npm `three@0.128.0`) | `node_modules/three/build/three.min.js` from `npm install three@0.128.0` | MIT, see `three.LICENSE` |

`three.min.js` is byte-identical to `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`, the copy the single-file build loads.
SHA-256: `9274bbcec8d96168626c732b5d31c775aa8cfb7eaa0599bec0c175908a2c1ce2`.

## How it is used

- `npm run build:web` points `dist/web/index.html` at `vendor/three.min.js` and copies this folder into `dist/web/vendor/`, so the game folder runs offline. `--three=cdn` keeps the CDN tag instead.
- The single-file build keeps the CDN tag (see D-015 in `docs/DECISIONS.md`).
- The address and version live in `tools/lib.mjs` (`THREE_CDN`, `THREE_VERSION`). The build fails loudly if the template stops loading that address.

## Updating

Do not upgrade casually: the game uses r128 APIs. To change version, install the new package in a scratch folder (not in this repository), copy `build/three.min.js` and `LICENSE` here, update the table above, `THREE_CDN` and `THREE_VERSION` in `tools/lib.mjs`, the script tag in `src/html/index.template.html`, and log the decision.
