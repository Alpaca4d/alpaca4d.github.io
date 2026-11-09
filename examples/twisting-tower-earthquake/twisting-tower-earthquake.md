---
order: 2.102
summary: "A thirty-storey concrete tower whose floors turn a quarter turn from the ground to the roof, shaken by the El Centro earthquake in a transient analysis."
tags: ["Beams & frames", "Shells", "Dynamics"]
---

# 🌀 Twisting Tower in an Earthquake

<figure><img src="twisting-tower-earthquake.png" alt="A thirty-storey tower twisting a quarter turn from its foot to its roof, swaying under the El Centro earthquake, its slabs in iso-surfaces of displacement"><figcaption></figcaption></figure>

[twisting-tower-earthquake](twisting-tower-earthquake.gh)

Thirty storeys of a concrete frame, four bays of 7 m each way, every floor turned 3° further round than the one under it: a quarter turn from the ground to the roof. The columns lean round the tower from floor to floor, each a straight piece a storey tall, and the beams and a 220 mm slab at every floor turn with them. The El Centro earthquake shakes the ground along x.

<figure><video src="twisting-tower-earthquake-shaking.mp4" autoplay loop muted playsinline></video><figcaption><p>The first 20 s of El Centro, as they happened, the movement drawn larger than it is. Beside it, the ground's acceleration and the movement along x of the corner of the roof, over the same 20 s.</p></figcaption></figure>

## The model

| Group | What it does |
| --- | --- |
| 1 - Geometry | The sliders - **Bays each way**, **Bay**, **Storeys**, **Storey height** and **Twist** - and a Python component that draws the frame from them: each floor's grid turned about the middle by **Twist** times its height over the tower's, a column from each corner to the same corner a floor up, the beams cut twice a bay, a slab mesh at every floor, the columns' feet, and the corner of the roof the charts follow. |
| 2 - Members | Concrete C30/37 from [Material Library](../../docs/basics/materials/MaterialDatabase.md); columns 1 × 1 m and beams 0.45 × 0.8 m, [RectangleCS](../../docs/basics/sections/rectangular.md) sections, as [ForceBeamColumn](../../docs/basics/elements/force-beam-column.md); 220 mm of concrete, a [Plate Fiber Section](../../docs/basics/sections/plate-fiber.md), as [ASD Shell](../../docs/basics/elements/shell.md)s. |
| 3 - Supports | Every column built in at the ground, with a [Support](../../docs/basics/elements/support.md). |
| 4 - Ground motion | The El Centro record from a Python component, its first **Duration** seconds times **Ground motion scale**; a Path Time Series of it; a Load Pattern of the UniformExcitation type, along the direction it shakes. |
| 5 - Transient analysis | [Assemble](../../docs/basics/assemble.md), with an [MPCO Recorder](../../docs/basics/mpco-recorder.md) of the displacements alone, which is all the view reads; [Damping](../../docs/basics/analysis/damping.md), Rayleigh's from **Damping** and its two frequencies; the Newmark [Integrator](../../docs/basics/analysis/integrator.md); [Analysis Step](../../docs/basics/analysis/analysis-step.md), a step a sample of the record; [Analysis Settings](../../docs/basics/analysis/analysis-settings.md) for a transient analysis with the Linear algorithm, one solve a step, as an elastic model needs; and Run Analysis. |
| 6 - Results | A [Model View](../../docs/basics/visualisation/model-view.md) of the analysed model at **Step**, deformed 15 times, its elements' edges and its supports drawn, its colours in iso-surfaces on the slabs over 0 to 400 mm for every step alike, with a [Legend](../../docs/basics/visualisation/legend.md). Drag **Step** to go through the record. |

Its 5 070 elements are past the free limit of 50: it needs a licence. The analysis takes about three minutes on a laptop; then each step takes a second or a few to draw as you drag **Step**.

## The ground motion

El Centro, 18 May 1940, the north-south component: 0.32 g at its peak, 2 s in, the first 20 s of it. A [Path Time Series](../../docs/basics/time-history/path.md) of its accelerations shakes the ground under the whole structure through a [Load Pattern](../../docs/basics/loads/load-pattern.md)'s UniformExcitation type, and [Run Analysis](../../docs/basics/analysis/run-analysis.md) follows it step by step, 0.02 s at a time, a transient analysis with Newmark's average acceleration. Damping is Rayleigh's, 5% of critical at two frequencies that bracket the modes that matter. **Ground motion scale** makes the record stronger or weaker, **Duration** takes more or less of it.

## What it shows

The tower sways along x, more the higher up: the corner of its roof moves 360 mm at the most, 4.9 s in. Twisted, it sways a little slower than it would straight - its first period is 3.2 s, against 2.6 s with **Twist** at 0 - as its columns lean. But it is stiffer in twist: the leaning columns brace it like a spiral, and its first twisting mode has a period of 1.6 s, against 2.1 s straight.

<figure><img src="twisting-tower-earthquake-2.png" alt="A thirty-storey tower twisting a quarter turn from its foot to its roof, swaying under the El Centro earthquake, its slabs in iso-surfaces of displacement, at the moment it moves the most, with the ground's acceleration and its movement until then"><figcaption><p>The moment it moves the most, and the record up to then.</p></figcaption></figure>

## Try

- **Twist** at 0 for a straight tower, at 180 for a half turn: compare their periods with a [Natural Vibration Analysis](../../docs/basics/analysis/natural-vibration.md) on the same Assemble.
- **Storeys**: a taller tower sways slower and further.
- **Ground motion scale** at 2: twice the movement. The model is elastic, so everything scales with the ground.
