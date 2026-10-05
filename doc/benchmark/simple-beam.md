# 🍏 Simple Beam

Two textbook beams under a uniform load, and a cantilever left to vibrate, solved by Alpaca4d and
set against the closed-form answers. Every Alpaca4d value on this page was produced by running the
Grasshopper definitions you can download below — nothing typed in by hand.

## The model

| | |
| --- | --- |
| Span | L = 5 m |
| Line load | q = 6 kN/m, downwards |
| Section | 300 × 300 mm rectangle: A = 0.09 m², I = 6.75·10⁸ mm⁴ (6.75·10⁻⁴ m⁴), shear area κA = 5/6 A |
| Material | E = 2.07·10⁵ N/mm², ν = 0.3, G = E / 2(1 + ν) = 7.96·10⁴ N/mm² |
| Elements | 10 [Force Beam Columns](../basics/elements/force-beam-column.md), five integration points each |
| Analysis | linear static, one step |

Built from Alpaca4d components only — Uniaxial, RectangleCS, ForceBeamColumn, Support, Linear Load,
Load Pattern, Assemble Model, Analysis Settings, Run Analysis, Beam Forces and Nodal Displacements —
with Grasshopper's own Line, Divide Curve and Shatter for the geometry and Bounds to read off the
extremes.

{% hint style="info" %}
**Why the deflections differ from the textbook by under 1%.** The textbook formulas are
Euler-Bernoulli: they ignore the shear strain in the beam. Alpaca4d's elastic sections do not — a
rectangle carries a shear area of 5/6 of its area — so the beam is a Timoshenko beam and deflects a
little more. Adding the shear term to the textbook formula gives Alpaca4d's numbers to six figures,
which is the check that matters: the difference is physics the model includes, not error.
{% endhint %}

## 1. Simply supported beam

Pinned at one end, on a roller at the other.

### 1.1 Bending moment

$$
M_{max} = \frac{1}{8}ql^2 = \frac{1}{8}\cdot 6 \cdot 5^2 = \mathbf{18.75}\; kNm
$$

### 1.2 Shear force

$$
V_{max} = \frac{1}{2}ql = \frac{1}{2}\cdot 6\cdot 5 = \mathbf{15.0}\: kN
$$

### 1.3 Displacement at mid-span

Bending only (Euler-Bernoulli):

$$
\delta_{b} = \frac{5\: ql^4}{384\: EI} = \frac{5\cdot 6\cdot 5^4}{384 \cdot 2.07\cdot 10^{8} \cdot 6.75\cdot 10^{-4}} = \mathbf{0.3495}\; mm
$$

The shear term (Timoshenko):

$$
\delta_{s} = \frac{ql^2}{8\: G\: \kappa A} = \frac{6\cdot 5^2}{8 \cdot 7.96\cdot 10^{7} \cdot 0.075} = 0.0031\; mm
\qquad
\delta = \delta_b + \delta_s = \mathbf{0.3526}\; mm
$$

### 1.4 Benchmark

| Simply supported | Beam theory | Alpaca4d | Difference |
| --- | --- | --- | --- |
| Shear force | 15.00 kN | 15.00 kN | 0.00% |
| Bending moment | 18.75 kNm | 18.75 kNm | 0.00% |
| Displacement, bending and shear | 0.3526 mm | 0.3526 mm | 0.00% |
| Displacement, bending only | 0.3495 mm | 0.3526 mm | +0.90% — the shear term |

### 1.5 Download Grasshopper benchmark file

{% file src="../.gitbook/assets/Alpaca4d_Benchmark_SimplySupported.gh" %}

## 2. Cantilever beam

Fixed at one end, free at the other. Same beam, same load.

### 2.1 Bending moment

$$
M_{max} = \frac{1}{2}ql^2 = \frac{1}{2}\cdot 6 \cdot 5^2 = \mathbf{75.0}\; kNm
$$

### 2.2 Shear force

$$
V_{max} = ql = 6\cdot 5 = \mathbf{30.0}\: kN
$$

### 2.3 Displacement at the tip

Bending only (Euler-Bernoulli):

$$
\delta_{b} = \frac{ql^4}{8\: EI} = \frac{6\cdot 5^4}{8 \cdot 2.07\cdot 10^{8} \cdot 6.75\cdot 10^{-4}} = \mathbf{3.3548}\; mm
$$

The shear term (Timoshenko):

$$
\delta_{s} = \frac{ql^2}{2\: G\: \kappa A} = \frac{6\cdot 5^2}{2 \cdot 7.96\cdot 10^{7} \cdot 0.075} = 0.0126\; mm
\qquad
\delta = \delta_b + \delta_s = \mathbf{3.3674}\; mm
$$

### 2.4 Benchmark

| Cantilever | Beam theory | Alpaca4d | Difference |
| --- | --- | --- | --- |
| Shear force | 30.00 kN | 30.00 kN | 0.00% |
| Bending moment | 75.00 kNm | 75.00 kNm | 0.00% |
| Displacement, bending and shear | 3.3674 mm | 3.3674 mm | 0.00% |
| Displacement, bending only | 3.3548 mm | 3.3674 mm | +0.37% — the shear term |

### 2.5 Download Grasshopper benchmark file

{% file src="../.gitbook/assets/Alpaca4d_Benchmark_Cantilever.gh" %}

## 3. Cantilever, natural vibration

A slender steel bar, fixed at one end and free at the other: its first bending frequencies against
Euler-Bernoulli.

| | |
| --- | --- |
| Span | L = 5 m |
| Section | 100 × 100 mm square bar: I = 8.33·10⁶ mm⁴, mass per length ρA = 78.5 kg/m |
| Material | E = 2.1·10⁵ N/mm², ν = 0.3, ρ = 7850 kg/m³ |
| Elements | 20 [Force Beam Columns](../basics/elements/force-beam-column.md) |
| Analysis | [Natural Vibration](../basics/analysis/natural-vibration.md), 6 modes |

The bar is square, so every frequency comes twice — once bending about each axis — and the six
modes are the first three bending modes, each in two directions.

### 3.1 Frequencies

$$
f_i = \frac{\lambda_i^2}{2\pi L^2}\sqrt{\frac{EI}{\rho A}}
\qquad
\lambda_1 = 1.8751,\;\; \lambda_2 = 4.6941,\;\; \lambda_3 = 7.8548
$$

With EI = 1.75·10⁶ Nm² and ρA = 78.5 kg/m:

$$
f_1 = \mathbf{3.342}\; Hz \qquad f_2 = \mathbf{20.944}\; Hz \qquad f_3 = \mathbf{58.645}\; Hz
$$

### 3.2 Benchmark

| Modes | Euler-Bernoulli | Alpaca4d, 20 elements | Difference | Alpaca4d, 40 elements | Difference |
| --- | --- | --- | --- | --- | --- |
| 1 and 2 | 3.342 Hz | 3.337 Hz | −0.14% | 3.340 Hz | −0.05% |
| 3 and 4 | 20.944 Hz | 20.826 Hz | −0.56% | 20.888 Hz | −0.27% |
| 5 and 6 | 58.645 Hz | 58.031 Hz | −1.05% | 58.315 Hz | −0.56% |

{% hint style="info" %}
**Why Alpaca4d is a little low, and closes in as the mesh is refined.** Two things lower the
frequencies. A small, fixed part — 0.02%, 0.17% and 0.40% for the three modes — is shear
deformation, which Alpaca4d's beams include and Euler-Bernoulli leaves out. The rest is the mass: a
Force Beam Column carries it at its two nodes, half each, with no rotary inertia, and lumped mass
makes a beam vibrate slightly slower than the continuous bar. That part shrinks fourfold each time
the elements are halved.
{% endhint %}

### 3.3 Download Grasshopper benchmark file

{% file src="../.gitbook/assets/Alpaca4d_Benchmark_CantileverVibration.gh" %}

## 💡 Why the forces are exact

A [Force Beam Column](../basics/elements/force-beam-column.md) is a force-based element: it takes the
internal forces from equilibrium with the loads on it, the line load included, rather than from an
assumed displacement field. So the shear and moment at its integration points are exact whatever the
mesh — one element would give the same 18.75 kNm — and the nodal displacements are exact too. More
elements only add places where the forces are reported.

The shear is the largest at the supports and the moment at mid-span (simply supported) or at the
fixed end (cantilever); all of them are integration points, so the extremes are read exactly. The
deflection is read at a node: with an odd number of elements the simply supported beam has none at
mid-span, and its largest deflection falls between the nodes reported — the moment there is still
read, at the middle element's own middle integration point.

## ⚙️ How the numbers were produced

Solved on 5 October 2026 with Alpaca4d 0.11.0 and OpenSees 3.8.0, in Rhino 8.26. The definitions
were built, solved and read by a script running inside Rhino, so the values in the tables are
Alpaca4d's own output, to the digits shown. Open a static definition and the panels on the right
show the range of the shear, the moment and the vertical displacement; open the vibration one and a
panel lists the frequencies. The 40-element column comes from the same definition with 40 elements.
