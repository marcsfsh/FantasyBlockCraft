# Performance

`npm run bench` (`tools/bench.mjs`) measures CPU cost headlessly through the test harness. It is not part of `npm test`, has no pass/fail threshold, and does not render: three.js is stubbed, so "meshing" is the time to build a chunk's vertex buffers, not GPU upload or drawing. Browser numbers will differ (the 20 ms per chunk in `KNOWN_ISSUES.md` was observed in a browser); use this to compare before and after a change on the same machine.

```
npm run bench                       # seeds 123456789 and 4242, one run each
node tools/bench.mjs --runs=3       # three runs per seed
node tools/bench.mjs --seed=777 --json
```

| Measure | What it times |
|---|---|
| startup | From loading the bundle to the starting world being ready: atlas, 5 x 5 chunks generated, full lighting, minimap, 5 x 5 chunks meshed. Excludes Node start-up and anything the browser does |
| genChunk | `genChunk` alone, for each of the 196 loaded chunks, after a JIT warm-up |
| stream 1 chunk | One streaming step as `processGenQ` runs it: generate, light, minimap column, map tile |
| buildChunk | Meshing one chunk with all neighbours present, mesh band at the surface (`MB` around sea level) |
| lightAll | Full block-light recompute of the loaded window |

## Baseline (2026-10-07, before any optimisation)

Measured on the **Claude Code cloud VM**: Intel Xeon @ 2.10 GHz, 4 cores, 15 GB, Linux x64, Node v22.22.0. `node tools/bench.mjs --runs=3`. Times in ms as mean / median / p95 / max.

| Seed | Startup | genChunk | Stream 1 chunk | buildChunk | lightAll |
|---|---|---|---|---|---|
| 123456789 | 1591 | 12.08 / 11.44 / 17.5 / 19.64 | 14.41 / 13.43 / 20.97 / 24.98 | 13.75 / 13.06 / 20.5 / 43.3 | 82 |
| 123456789 | 1665 | 10.95 / 10.84 / 12.6 / 16.52 | 12.7 / 12.46 / 16 / 19.22 | 14.62 / 12.79 / 27.04 / 31.81 | 61 |
| 123456789 | 1683 | 11.06 / 10.72 / 15.23 / 18.32 | 12.56 / 12.33 / 15.35 / 19.69 | 13.43 / 12.51 / 19.96 / 34.63 | 63 |
| 4242 | 1708 | 11.35 / 11.16 / 13.53 / 21.45 | 13.05 / 12.87 / 16.15 / 21.28 | 12.41 / 11.41 / 20.42 / 25.99 | 63 |
| 4242 | 1694 | 12.65 / 11.74 / 19.48 / 20.08 | 13.67 / 12.91 / 19.39 / 22.97 | 11.86 / 11.05 / 19.25 / 22.86 | 64 |
| 4242 | 1776 | 11.77 / 11.57 / 14.17 / 18.3 | 14.07 / 13.63 / 18.44 / 20.22 | 13.95 / 12.04 / 25.18 / 37.17 | 66 |

Reading it: one streamed chunk costs about 13 ms of CPU here, against a 5 ms per-frame budget in `processGenQ` that cannot split a chunk, which is the streaming hitch in `KNOWN_ISSUES.md`. Run-to-run noise on this VM is roughly 10% on means and more on p95 and max, so compare medians over `--runs=3` and treat differences under about 10% as noise.

When a change targets performance, add a dated row set here (same command, same machine type) and say in the PR what moved.

## After M0 (2026-10-08, 0.2.0)

Same machine type and command. The deepstone line in `fillCol` is now computed once per column instead of once per stone block, with an identical world (09-world-hash unchanged for that change).

| Seed | Startup | genChunk | Stream 1 chunk | buildChunk | lightAll |
|---|---|---|---|---|---|
| 123456789 | 1603 | 8.66 / 8.29 / 11.72 / 14.17 | 10.19 / 9.86 / 14.08 / 16.46 | 12.98 / 12.52 / 19.65 / 24.46 | 71 |
| 123456789 | 1672 | 8.51 / 8.12 / 11.56 / 13.03 | 9.9 / 9.53 / 14.13 / 15.81 | 12.09 / 11.59 / 18.35 / 29.12 | 70 |
| 123456789 | 1537 | 8.5 / 8.12 / 11.02 / 15.13 | 9.37 / 9.36 / 10.54 / 13.3 | 12.4 / 11.79 / 18.47 / 22.99 | 64 |
| 4242 | 1655 | 8.39 / 8.24 / 9.88 / 13.96 | 10.12 / 9.52 / 15.79 / 20.03 | 12.07 / 10.68 / 20.19 / 30.53 | 65 |
| 4242 | 1795 | 9.06 / 8.77 / 11.76 / 15.78 | 10.45 / 10.14 / 13.36 / 20.18 | 12.74 / 11.67 / 20.46 / 26.94 | 74 |
| 4242 | 1628 | 8.81 / 8.55 / 12.05 / 13.96 | 11.41 / 11.05 / 14.59 / 21.56 | 12.74 / 11.99 / 19.53 / 22.13 | 66 |

genChunk medians fell from about 10.7 to 11.7 ms to about 8.1 to 8.8 ms (roughly 25%); one streamed chunk from about 12.3 to 13.6 ms to about 9.4 to 11 ms. Meshing is unchanged.

