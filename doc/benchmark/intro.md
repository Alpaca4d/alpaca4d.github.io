# 🧑‍🌾 Intro

By using benchmarks to evaluate the performance of a structural engineering API, developers can ensure that their software is accurate, efficient, and capable of handling a wide range of complex calculations. This not only helps to ensure that the API is reliable and robust, but also helps to inspire confidence among engineers and other professionals who rely on it to design and analyze structures.

| Benchmark | Test | What it checks | Largest difference, on the definition's mesh |
| --- | --- | --- | --- |
| [🍏 Simple Beam](simple-beam.md) | Simply supported beam | Shear, moment and deflection under a uniform load against beam theory | 0.00% |
| | Cantilever | The same, fixed at one end | 0.00% |
| | Cantilever, natural vibration | First three bending frequencies against Euler-Bernoulli | −1.05% |
| [🍐 Simple Shell](simple-shell.md) | Plate under pressure (ASDEA ST6) | Centre deflection against plate theory | −0.07% |
| | Cantilevered plate, natural vibration (NAFEMS FV16) | First six frequencies against NAFEMS and converged plate theory | −1.90% against NAFEMS, −1.42% against converged plate theory |
| [🍌 Simple Brick](simple-brick.md) | Cantilever of bricks | Tip deflection under an end load against Timoshenko | −1.39% |
| | Solid plate, natural vibration (NAFEMS FV52) | Ten modes, three of them rigid-body, against NAFEMS | −0.11% |

Most of the tests come from the verification ASDEA publishes for STKO and OpenSees, and from the
NAFEMS standard benchmarks it draws on — the same tests other finite element programs are checked
against. Where a page gives Alpaca4d's values, they come from running the downloadable Grasshopper
definition itself — built from Alpaca4d's own components and solved in Rhino by a script — not typed
in by hand. Where Alpaca4d differs from the reference, the page says why — and where the mesh is
the reason, shows the difference closing as it is refined. The script that regenerates every value
lives in the Alpaca4d repository, in `Alpaca4d.Test/Benchmark/`.
