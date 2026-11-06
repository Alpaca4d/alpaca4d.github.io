# 🏛️ Column Domain

<figure><img src="https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/refs/heads/main/doc/examples/column-domain/column-domain.png" alt="A 400 x 600 reinforced concrete column in Rhino: its fibre section, its N-My-Mz domain, its My-Mz diagrams at three axial forces with three design combinations checked against them, its N-My and N-Mz diagrams, and its results"><figcaption></figcaption></figure>

[column-domain](https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/main/doc/examples/column-domain/column-domain.gh)

A 400 × 600 reinforced concrete column: its N–My–Mz resistance domain at the ultimate limit
state from [Interaction Domain](../../basics/moment-curvature/interaction-domain.md), three
combinations of design forces checked against it with
[Domain Check](../../basics/moment-curvature/domain-check.md), and the domain drawn with the
three [views](../../basics/moment-curvature/domain-views.md).

## The model

| Group | What it does |
| --- | --- |
| 1 - Design materials | [Concrete01](../../basics/moment-curvature/concrete01.md) with `fco = fcu = -17000` kN/m² (C30/37: 0.85 × 30 / 1.5 MPa), `EpsilonCo = -0.002` and `EpsilonCu = -0.0035`: Eurocode 2's parabola–rectangle. [Steel01](../../basics/moment-curvature/steel01.md) with `fy = 434783` kN/m² (B500: 500 / 1.15 MPa) and `b = 0`: elastic–perfectly plastic. |
| 2 - Concrete and bars | The outline, a Rectangle 3Pt, meshed by Mesh Plane into 16 × 24 faces for a [Patch](../../basics/moment-curvature/patch.md): one fibre a face. A [Fiber Point](../../basics/moment-curvature/fiber-point.md) for each bar: φ25 at the corners, φ20 at mid-height, 50 mm to their centres. |
| 3 - Section and domain | [Fiber Section](../../basics/moment-curvature/fiber-section.md) and Interaction Domain, with its defaults: εud 1 % for the bars, and the concrete's own 3.5 ‰. **Materials** shows the limits each material is held to. |
| 4 - Checks | Three combinations of N, My and Mz in Domain Check, and a **Method** list to switch between holding N and scaling all three. |
| 5 - Views | Domain 3D, N–M Diagram and My–Mz Diagram, each on an XY plane of its own to the right of the section, with the checks drawn on them. |

## What it shows

The axial resistances are what a hand calculation gives: in compression the concrete at fcd and
the bars at Es εc2 = 400 MPa, as the strain is held to 2 ‰ in full compression; in tension the
bars at fyd.

| | kN |
| --- | --- |
| Nc = −(fcd Ac + 400 MPa As) | −5117 |
| Nt = fyd As | 1127 |

| N | My | Mz | SF, Constant N | SF, Proportional |
| --- | --- | --- | --- | --- |
| −2000 | 250 | 80 | 1.59 | 1.42 |
| −1000 | 400 | 150 | **0.89** | **0.88** |
| −3000 | 100 | 60 | 2.74 | 1.44 |

The second combination fails. With **Method** on Constant N each check's red point lies on the
My–Mz diagram at its own N, as the figure shows; switch to Proportional and the third
combination's factor drops from 2.74 to 1.44. It is mostly axial, so scaling N with the moments
takes it towards the compression pole much sooner than holding N does.

{% hint style="info" %}
The bars' area is not taken out of the concrete patch: the concrete is the full 400 × 600. Draw
the patch with the bars' holes in it for the difference, a little under 1 % here.
{% endhint %}

## Things to try

- **Turn Angle** on the N–M Diagram from 0 to 90: from the N–My diagram to the N–Mz one, through
  every skew cut between.
- **Set εud** to `0.0675`, 0.9 εuk of a class B bar, and see how little the domain changes:
  0.7 % more moment at N = 0, 1.5 % with 500 kN of tension, nothing at all in compression, where
  the concrete's limit governs.
- **Move a bar** and watch the domain shift: moments are taken about the area centroid of every
  fibre, so an unsymmetric section's domain is off-centre.
