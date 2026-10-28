# 🧪 Topology Benchmarks

<figure><img src="https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/refs/heads/main/doc/examples/topology-benchmarks/topology-benchmarks.png" alt="The cantilever after 200 iterations: top and bottom flanges joined by diagonal webs"><figcaption></figcaption></figure>

<figure><img src="https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/refs/heads/main/doc/examples/topology-benchmarks/topology-benchmarks-2.png" alt="The simply supported beam after 200 iterations: a truss with its tie thickest at mid-span"><figcaption></figcaption></figure>

[topology-benchmarks](https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/main/doc/examples/topology-benchmarks/topology-benchmarks.gh)

The two benchmarks of [Topology Optimisation](../../basics/optimisation/topology-optimisation.md),
ready to run. Both are problems from top3d (Liu and Tovar, 2014), set up in its units: a unit
modulus, Poisson 0.3, unit cubes and loads of 1. They also use its settings: 30% of the volume,
a penalty of 3, a filter radius of 1.5 and at most 200 iterations. Each problem has its own **Run**
toggle. Beside it are panels giving the compliance that Alpaca4d's test bench and top3d reach after
200 iterations, to compare with.

{% hint style="info" %}
Topology Optimisation needs a license.
{% endhint %}

## The model

| Group | What it does |
| --- | --- |
| 1 - top3d's material | An [nD](../../basics/materials/ND.md) material with E = 1 and ν = 0.3. |
| 2 - Cantilever | 60 x 4 x 20 unit [SSP Bricks](../../basics/elements/brick.md), held at every node of the end at x = 0. A [Point Load](../../basics/loads/point-load.md) of -1 acts at each node of the bottom edge of the free end. This is top3d's own example, `top3d(60,20,4,0.3,3,1.5)`. |
| 3 - Simply supported beam | 120 x 4 x 20 bricks. They are pinned along the bottom edge at x = 0 and on rollers, free along X, along the bottom edge at x = 120. A load of -1 acts at each node of the top edge at mid-span. |
| 4 - Cantilever, optimised | [Assemble](../../basics/assemble.md), then Topology Optimisation with top3d's settings, **Run Cantilever** and **Step Cantilever**. Panels show the last compliance, the iterations run, what to expect and the history. |
| 5 - Simply supported, optimised | The same for the simply supported beam. |

## Running them

1. Set **Run Cantilever** to `true`. Its **Surface** draws as the run goes. The run ends after
   200 iterations, about 45 seconds on an Apple M2 Pro. Neither problem reaches top3d's tolerance
   of 0.01 before then, and neither does top3d.
2. Compare **Compliance, last iteration** with the panels under it: 2415.86 from Alpaca4d's test
   bench and 2415.82 from top3d.
3. Do the same for the simply supported beam with **Run Simply supported**. It takes about
   90 seconds, and both values are 1203.026.
4. Drag a **Step** slider back to watch its run again, design by design.

## What to expect

- The cantilever ends as a top flange and a bottom flange joined by diagonal webs.
- The simply supported beam ends as a truss, with its tie thickest at mid-span.
- The first iterations agree with top3d to round-off. The two cantilever runs part by up to 0.2%
  around iteration 70, while the design rearranges itself, and then come back together.

The numbers, and the comparison of each design with top3d's, are on the
[Topology Optimisation](../../basics/optimisation/topology-optimisation.md) page.
