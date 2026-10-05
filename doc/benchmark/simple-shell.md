# 🍐 Simple Shell

Two flat plates, solved by Alpaca4d and set against plate theory: a square plate under a uniform
pressure, and a thin square cantilever left to vibrate. Both are standard verification tests — the
first is ST6 of ASDEA's verification of STKO and OpenSees, the second is NAFEMS FV16 — and every
Alpaca4d value on this page was produced by running the Grasshopper definitions you can download
below, nothing typed in by hand.

## 1. Simply supported plate under a uniform pressure

| | |
| --- | --- |
| Plate | 0.8 × 0.8 m, t = 8 mm |
| Material | [nD](../basics/materials/ND.md) Elastic Isotropic: E = 2.1·10⁵ N/mm², ν = 0.3 |
| Load | p = 1 kN/m², downwards, with [Mesh Load](../basics/loads/shell-load.md) |
| Elements | 16 × 16 [ASD Shells](../basics/elements/shell.md) (ASDShellQ4) on a [Plate Fiber Section](../basics/sections/plate-fiber.md) |
| Supports | every edge simply supported — see below |
| Analysis | linear static, one step |

Built from Alpaca4d components only — nD, Plate Fiber Section, ASD Shell, Support, Mesh Load, Load
Pattern, Assemble Model, Analysis Settings, Run Analysis and Nodal Displacements — with Grasshopper's
own Mesh Plane for the mesh, Divide Curve and List Item to pick the edge nodes, and Bounds to read off
the deflection.

{% hint style="info" %}
**Simple support on a shell: hold one rotation too.** Plate theory's simple support stops the edge
moving vertically, and since that holds all along the edge, the edge cannot tilt along its own
length either: the plate hinges *about* the edge but not across it. So on each edge Alpaca4d holds
the vertical displacement and the rotation about the edge's in-plane normal — Ry on the edges
along x, Rx on the edges along y, both at the corners — and leaves the hinge rotation free. The
in-plane displacements are held too, which a flat plate in linear bending never notices.
{% endhint %}

### 1.1 Deflection at the centre

Navier's double series for a simply supported square plate gives, at the centre,

$$
w = \alpha\,\frac{p\,a^4}{D}, \qquad D = \frac{E\,t^3}{12\,(1 - \nu^2)} = 9.846\; kNm, \qquad \alpha = 0.0040624
$$

$$
w = 0.0040624 \cdot \frac{1 \cdot 0.8^4}{9.846} = \mathbf{1.6899 \cdot 10^{-4}}\; m
$$

— the 1.689·10⁻⁴ m that ST6 quotes from Timoshenko & Woinowsky-Krieger.

### 1.2 Benchmark

| ASDShellQ4 mesh | Plate theory | Alpaca4d | Difference |
| --- | --- | --- | --- |
| 8 × 8 | 1.6899 · 10⁻⁴ m | 1.6821 · 10⁻⁴ m | −0.46% |
| **16 × 16 — the definition** | 1.6899 · 10⁻⁴ m | 1.6887 · 10⁻⁴ m | −0.07% |
| 32 × 32 | 1.6899 · 10⁻⁴ m | 1.6903 · 10⁻⁴ m | +0.02% |
| 16 × 16, soft support | 1.6899 · 10⁻⁴ m | 1.6912 · 10⁻⁴ m | +0.07% |
| 32 × 32, soft support | 1.6899 · 10⁻⁴ m | 1.6951 · 10⁻⁴ m | +0.30% |

The deflection converges on plate theory as the mesh is refined. ASDEA's own verification of the
same test, on a quarter of the plate, reports −0.53% and −1.12% for OpenSees's ShellDKGT and
ShellANDeS.

The last two rows leave the edge rotations free — the "soft" simple support. An ASD Shell is a
Mindlin shell: it carries transverse shear, and with soft supports it develops a narrow band near
each edge, about a thickness wide, where the plate twists more freely. A fine mesh resolves the band
and the plate grows softer than plate theory, which has no such band. That is real shell behaviour,
not error — but the benchmark compares like with like.

### 1.3 Download Grasshopper benchmark file

{% file src="../.gitbook/assets/Alpaca4d_Benchmark_PlatePressure.gh" %}

## 2. Cantilevered thin square plate, natural vibration — NAFEMS FV16

| | |
| --- | --- |
| Plate | 10 × 10 m, t = 0.05 m |
| Material | [nD](../basics/materials/ND.md) Elastic Isotropic: E = 2.0·10⁵ N/mm², ν = 0.3, ρ = 8000 kg/m³ |
| Elements | 16 × 16 [ASD Shells](../basics/elements/shell.md) (ASDShellQ4) on a [Plate Fiber Section](../basics/sections/plate-fiber.md) |
| Supports | one edge clamped — every displacement and rotation held along x = 0 |
| Analysis | [Natural Vibration](../basics/analysis/natural-vibration.md), 6 modes |

### 2.1 Benchmark

| Mode | NAFEMS | Alpaca4d, 16 × 16 | Difference |
| --- | --- | --- | --- |
| 1 | 0.421 Hz | 0.418 Hz | −0.81% |
| 2 | 1.029 Hz | 1.021 Hz | −0.81% |
| 3 | 2.582 Hz | 2.557 Hz | −0.98% |
| 4 | 3.306 Hz | 3.243 Hz | −1.90% |
| 5 | 3.753 Hz | 3.706 Hz | −1.26% |
| 6 | 6.555 Hz | 6.432 Hz | −1.88% |

ASDEA's verification of the same element on its regular fine mesh reports 0.418, 1.021, 2.557,
3.243, 3.706 and 6.431 Hz: the same as Alpaca4d to the third decimal, bar the last digit of mode 6.

### 2.2 Against converged plate theory

NAFEMS's targets are classic Ritz solutions: the first five are Young's and Barton's of 1950–51
(frequency parameters λ = ωa²√(ρt/D) = 3.494, 8.547, 21.44, 27.46, 31.17), the sixth Leissa's of
1973 (54.443). A Ritz solution can only overestimate a frequency, and later, converged solutions of
the same Kirchhoff plate show these are high by up to 1%. Against the converged values Alpaca4d
closes in steadily as the mesh is refined:

| Mode | Plate theory, converged | Alpaca4d, 16 × 16 | Difference | Alpaca4d, 32 × 32 | Difference |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.4179 Hz | 0.4176 Hz | −0.08% | 0.4178 Hz | −0.02% |
| 2 | 1.0242 Hz | 1.0206 Hz | −0.35% | 1.0231 Hz | −0.11% |
| 3 | 2.5627 Hz | 2.5566 Hz | −0.24% | 2.5610 Hz | −0.07% |
| 4 | 3.2749 Hz | 3.2431 Hz | −0.97% | 3.2663 Hz | −0.26% |
| 5 | 3.7271 Hz | 3.7059 Hz | −0.57% | 3.7208 Hz | −0.17% |
| 6 | 6.5241 Hz | 6.4316 Hz | −1.42% | 6.4983 Hz | −0.40% |

Halving the element size cuts the difference by three to four times. The converged values come from a
Rayleigh-Ritz solution taken to five figures — λ = 3.4710, 8.5063, 21.284, 27.199, 30.955, 54.184 —
which agree with Sukhoterin et al. (2016) to the last digit they print; the script is in the
Alpaca4d repository, next to the one that builds these benchmarks.

{% hint style="info" %}
**Why Alpaca4d approaches from below.** An ASD Shell lumps its mass at its corner nodes and leaves
out rotary inertia. Lumped mass makes a coarse mesh vibrate a little slower than the continuous
plate, so the frequencies rise towards the exact ones as the mesh is refined. The higher modes have
shorter waves, which take more elements to follow, so they sit further below at any given mesh.
{% endhint %}

### 2.3 Download Grasshopper benchmark file

{% file src="../.gitbook/assets/Alpaca4d_Benchmark_PlateVibration_FV16.gh" %}

## ⚙️ How the numbers were produced

Solved on 5 October 2026 with Alpaca4d 0.11.0 and OpenSees 3.8.0, in Rhino 8.26. The definitions
were built, solved and read by a script running inside Rhino, so the values in the tables are
Alpaca4d's own output, to the digits shown; the other meshes in the tables are the same
definitions with a different count of faces. Open the pressure definition and a panel shows the
range of the vertical displacement; open the vibration one and a panel lists the frequencies.

## 📚 References

- ASDEA Software Technology, *Verification tests — STKO 2020 v1.1 and OpenSees 3.2.0*: ST6 and
  FV16.
- S. Timoshenko, S. Woinowsky-Krieger, *Theory of Plates and Shells*, 2nd ed., McGraw-Hill, 1959.
- NAFEMS, *The Standard NAFEMS Benchmarks*, TNSB Rev. 3, 1990: FV16.
- A. W. Leissa, "The free vibration of rectangular plates", *Journal of Sound and Vibration* 31,
  1973, pp. 257–293.
- M. V. Sukhoterin, S. O. Baryshnikov, D. A. Aksenov, "Free vibration analysis of rectangular
  cantilever plates using the hyperbolic-trigonometric series", *American Journal of Applied
  Sciences* 13 (12), 2016, pp. 1442–1451 — Table 1 collects the published solutions, from Young and
  Barton on.
