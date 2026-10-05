# Beam Stresses

The stresses along every beam element — axial, bending about each axis, the extreme direct
stress, shear and torsion, and the Von Mises equivalent — recovered from the beam forces with
elastic beam theory.

They depend on the section's **shape**, not its material: this is what a linear elastic section
of that shape carries under those forces. To check them against a strength, use
[Utilisation](utilisation.md).

## 🔧 Grasshopper component

`Beam Stresses (Alpaca4d)` — **Alpaca4d ▸ 08_NumericalOutput**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| History | `History` | Boolean | `false` | Read every recorded step instead of one. The outputs become trees `{step; element}`. **Step** is ignored. |
| Step | `Step` | Integer | `0` | Analysis step. |
| ElementId | `ElementId` | Text (list) | *(empty)* | Read only some of the beams: an ElementId, a wildcard over them, a tag, or a regular expression. Empty reads them all. |

### Outputs

All are **data trees, one branch per beam element**, keyed by its tag — the same layout as
[Beam Forces](beam-forces.md). Within a branch, the values are at the element's integration
points, from the I end to the J end.

Stresses are in **MPa** (N/mm²) — the unit steel and timber strengths are tabulated in, rather than
the model's `kN/m²`, which would read a thousand times larger.

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| SigmaN | `σN` | Number (tree) | Axial stress N/A. Positive is tension. |
| SigmaMy | `σMy` | Number (tree) | The largest bending stress My causes on its own, at the fibre furthest along local *z*. |
| SigmaMz | `σMz` | Number (tree) | The largest bending stress Mz causes on its own, at the fibre furthest along local *y*. |
| SigmaMax | `σmax` | Number (tree) | The largest direct stress anywhere on the section — N, My and Mz together. |
| SigmaMin | `σmin` | Number (tree) | The smallest, most compressive, direct stress anywhere on the section. |
| TauV | `τV` | Number (tree) | Peak shear stress from Vy and Vz. |
| TauT | `τT` | Number (tree) | Peak shear stress from torsion. |
| VonMises | `VonMises` | Number (tree) | √(σ² + 3τ²), σ the larger of σmax and σmin in size and τ = τV + τT. |
| Element | `Element` | Element (list) | The beams read, in the order of the branches. |

## 💡 How the stresses are worked out

**Direct stress.** σ = N/A − Mz·y/Iz + My·z/Iy, with *y* and *z* measured from the centroid — the
convention OpenSees bends its fibre sections by, so a positive Mz compresses the +y side. It is
checked at every corner of the shape, which is where a linear stress over a polygon has its
extremes, and exactly for a round section. An I with unequal flanges or a pair of angles has its
centroid away from the middle of the drawing, and the stresses are measured from it.

**Shear and torsion.** τ from Vy and Vz is the peak of the textbook (Jourawski) distribution,
V·S / (I·b), worked out piece by piece so that each flange outstand of an I carries its own share.
Torsion uses each shape's own formula:

| Shape | τ from V | τ from T |
| --- | --- | --- |
| [Rectangular](../sections/rectangular.md) | 1.5 V/A | Saint-Venant, within 0.5% of the tables |
| [Circular](../sections/circular.md), solid or tube | across a diameter: 4V/3A solid, → 2V/A thin | T·R / Ip |
| [Rectangular Hollow](../sections/rectangular-hollow.md) | through both walls | Bredt, T / (2·Am·t) |
| [I Section](../sections/h-section.md) | mid-web for Vy, each flange outstand for Vz | T·t / J, J = Σ b·t³/3 |
| [Double L-Angle](../sections/double-angle.md) | both long legs for Vy, the short leg's root for Vz | T·t / J |

{% hint style="warning" %}
**Von Mises is an upper bound.** It puts the worst σ with the worst τ, which rarely meet: bending
peaks at the corners, where a free surface carries no shear, and shear peaks on the neutral axis,
where bending is zero. Close to exact on slender members, conservative on short deep ones.
{% endhint %}

{% hint style="info" %}
A [Generic Section](../sections/parametric-cross-section.md) is a list of properties with no
shape behind it, so its beams give **σN only**; their other branches are empty, and the component
says so.
{% endhint %}

## 📈 When to use it

**Use it when**

- You want the stress in a beam rather than the force, to compare members of different sections.
- You need σ and τ separately — a timber check, say, treats bending and shear apart.

**Do not use it when**

- You want a code check of steel members → [Utilisation](utilisation.md).
- You want to see the stresses → [View Results](../visualisation/view-results.md), with *Beam
  stresses* picked as the result, colours the beams along their length.

## ✅ How it is checked

The direct stresses are compared, fibre by fibre, with the stresses OpenSees integrates in
elastic fibre sections — a round bar, a tube, an IPE 300, an unequal I and a pair of angles —
to within the fibre mesh, a few hundredths of a percent. The shears and torsion match the
published worked examples of Hibbeler's *Mechanics of Materials* to every digit printed.

Exact elasticity (a finite element solution of the cross-section) reads the shear from V up to
**10% higher** on thick round tubes, and about 4% on solid bars and thin tubes: Jourawski takes
the shear as uniform across a cut, and on a circle it is not. That is beam theory, not a bug — it
is what textbooks and EN 1993-1-1 6.2.6(4) use.
