# 🍌 Simple Brick

Two solids, solved by Alpaca4d with SSP bricks: a cantilever bar under an end load, set against
Timoshenko beam theory, and NAFEMS FV52, a thick plate left to vibrate. Every Alpaca4d value on
this page was produced by running the Grasshopper definitions you can download below, nothing typed
in by hand.

## 1. Cantilever of bricks under an end load

| | |
| --- | --- |
| Bar | L = 2 m, 200 × 200 mm square |
| Material | [nD](../basics/materials/ND.md) Elastic Isotropic: E = 2.1·10⁵ N/mm², ν = 0.3 |
| Load | P = 10 kN, downwards, on the free end |
| Elements | 20 × 4 × 4 [SSP Bricks](../basics/elements/brick.md), 20 along the bar |
| Supports | the fixed end: every node of the end face held in x, y and z |
| Analysis | linear static, one step |

Built from Alpaca4d components only — nD, Mesh Series to Brick, SSP Brick, Support, Point Load, Load
Pattern, Assemble Model, Analysis Settings, Run Analysis and Nodal Displacements — with
Grasshopper's own Mesh Plane for the cross-section, Series and Move to repeat it along the bar, and
List Item and Deconstruct Mesh to pick the end faces.

The load is spread over the end face as a uniform shear, the way a beam's end shear acts: each of
its 25 nodes takes its share in the proportions a bilinear face shares a uniform traction — ¼ for a
corner node, ½ for an edge node and 1 for an inner node, scaled to add up to 10 kN.

### 1.1 Deflection at the tip

Bending (Euler-Bernoulli):

$$
\delta_b = \frac{P\,L^3}{3\,E\,I} = \frac{10 \cdot 2^3}{3 \cdot 2.1\cdot 10^{8} \cdot 1.333\cdot 10^{-4}} = 0.9524\; mm
$$

The shear term (Timoshenko), with a shear area of 5/6 of the section:

$$
\delta_s = \frac{P\,L}{G\,\kappa A} = \frac{10 \cdot 2}{8.08\cdot 10^{7} \cdot 0.0333} = 0.0074\; mm
\qquad
\delta = \delta_b + \delta_s = \mathbf{0.9598}\; mm
$$

### 1.2 Benchmark

| SSP bricks | Timoshenko | Alpaca4d | Difference |
| --- | --- | --- | --- |
| **20 × 4 × 4, ν = 0.3 — the definition** | 0.9598 mm | 0.9464 mm | −1.39% |
| 40 × 8 × 8, ν = 0.3 | 0.9598 mm | 0.9506 mm | −0.95% |
| 20 × 4 × 4, ν = 0 | 0.9581 mm | 0.9572 mm | −0.09% |

Alpaca4d reads the deflection at the centre of the tip face.

{% hint style="info" %}
**Why the bricks are a little stiffer than the beam.** Holding every node of the end face does
more than fix a beam's end: it also stops that face contracting and swelling sideways, as Poisson's
ratio would have it under bending. Beam theory has no such effect; a solid does, and it stiffens the
bar near the support. The last row is the proof: with ν = 0 there is nothing to restrain, and the
bricks match Timoshenko to 0.09%. The restraint concentrates stress at the edges of the fixed face,
which a finer mesh follows more closely, so refining the mesh softens the bar somewhat — to −0.95%
at 40 × 8 × 8.
{% endhint %}

### 1.3 Download Grasshopper benchmark file

{% file src="../.gitbook/assets/Alpaca4d_Benchmark_BrickCantilever.gh" %}

## 2. Simply supported solid square plate, natural vibration — NAFEMS FV52

| | |
| --- | --- |
| Plate | 10 × 10 m, 1 m thick, from z = −0.5 to 0.5 |
| Material | [nD](../basics/materials/ND.md) Elastic Isotropic: E = 2.0·10⁵ N/mm², ν = 0.3, ρ = 8000 kg/m³ |
| Elements | 8 × 8 × 3 [SSP Bricks](../basics/elements/brick.md) — NAFEMS's own mesh |
| Supports | uz = 0 along the four edges of the bottom face, and nothing else |
| Analysis | [Natural Vibration](../basics/analysis/natural-vibration.md), 10 modes |

Nothing stops the plate sliding or spinning in its own plane, so its first three modes are those
rigid-body motions, at zero frequency. NAFEMS counts them, and so does the benchmark: ask for 10
modes, and the plate's own start at the fourth.

### 2.1 Benchmark

| Mode | NAFEMS | Alpaca4d, 8 × 8 × 3 | Difference | 16 × 16 × 4 |
| --- | --- | --- | --- | --- |
| 1 to 3 | 0 — rigid body | 0 — rigid body, below 10⁻⁴ Hz | — | — |
| 4 | 44.092 Hz | 44.076 Hz | −0.04% | 43.75 Hz |
| 5 | 106.66 Hz | 106.61 Hz | −0.05% | 105.43 Hz |
| 6 | 106.66 Hz | 106.61 Hz | −0.05% | 105.43 Hz |
| 7 | 156.23 Hz | 156.05 Hz | −0.11% | 157.15 Hz |
| 8 | 193.58 Hz | 193.58 Hz | 0.00% | 193.59 Hz |
| 9 | 200.13 Hz | 200.13 Hz | 0.00% | 198.45 Hz |
| 10 | 200.13 Hz | 200.13 Hz | 0.00% | 198.82 Hz |

On NAFEMS's mesh Alpaca4d is within 0.11% of every target, and on modes 8 to 10 it agrees to every
printed digit. ASDEA's verification of OpenSees's SSP brick on the same test, supported on the
mid-plane instead, reports up to 1.7%.

{% hint style="warning" %}
**This benchmark belongs to its mesh.** A support along a line is a singularity in a solid: the
finer the mesh, the narrower the strip of material that holds the plate up, and the softer that
support becomes, without limit. So FV52 has no mesh-independent answer, and NAFEMS's targets are for
its 8 × 8 × 3 mesh — the last column shows the same plate on a finer one drifting away from them.
The same is true of any model held along a line or at a point: to support a solid, hold a face.
{% endhint %}

### 2.2 Download Grasshopper benchmark file

{% file src="../.gitbook/assets/Alpaca4d_Benchmark_SolidPlateVibration_FV52.gh" %}

## ⚙️ How the numbers were produced

Solved on 5 October 2026 with Alpaca4d 0.11.0 and OpenSees 3.8.0, in Rhino 8.26. The definitions
were built, solved and read by a script running inside Rhino, so the values in the tables are
Alpaca4d's own output, to the digits shown; the other meshes and the ν = 0 row are the same
definitions with those inputs changed. Open the cantilever and a panel shows the range of the
vertical displacement; open FV52 and a panel lists the frequencies.

## 📚 References

- S. Timoshenko, J. M. Gere, *Mechanics of Materials*, Van Nostrand, 1972.
- NAFEMS, *The Standard NAFEMS Benchmarks*, TNSB Rev. 3, 1990: FV52.
- ASDEA Software Technology, *Verification tests — STKO 2020 v1.1 and OpenSees 3.2.0*: FV52.
