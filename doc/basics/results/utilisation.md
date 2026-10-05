# Utilisation

Checks every beam against the design code of its material and reports how much of each
resistance it uses: **1 is exactly at the limit**. Steel is checked to **EN 1993-1-1**
(Eurocode 3) — cross-section resistance and flexural buckling.

## 🔧 Grasshopper component

`Utilisation (Alpaca4d)` — **Alpaca4d ▸ 08_NumericalOutput**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| Step | `Step` | Integer | `0` | Which recorded step to check. |
| ElementId | `ElementId` | Text (list) | *(empty)* | Check only some of the beams: an ElementId, a wildcard over them, a tag, or a regular expression. Empty checks them all. |
| Length | `Length` | Number (list) | *(empty)* | Buckling length L_cr, in `m`, the same about both axes. One value for every beam, or one per beam checked, in the order of the **Element** output. Empty takes each beam's own length, node to node. |

### Outputs

One item per beam, in the order of the **Element** output. A check that could not be made is
**empty**, never zero.

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Axial | `Axial` | Number (list) | N against A·fy/γM0, in tension or compression (6.2.3, 6.2.4). |
| ShearY | `ShearY` | Number (list) | Vy against the plastic shear resistance, reduced for torsion (6.2.6, 6.2.7). Along the web of an I. |
| ShearZ | `ShearZ` | Number (list) | Vz against the plastic shear resistance, reduced for torsion. Across the flanges of an I. |
| Torsion | `Torsion` | Number (list) | St. Venant shear stress against fy/√3 (6.2.7). |
| BendingY | `BendingY` | Number (list) | My — the minor axis of an I — against Wpl·fy or Wel·fy, reduced for shear (6.2.5, 6.2.8). |
| BendingZ | `BendingZ` | Number (list) | Mz — the major axis of an I — against Wpl·fy or Wel·fy, reduced for shear. |
| Combined | `Combined` | Number (list) | Bending about both axes with axial force and shear (6.2.9, 6.2.10). |
| BucklingY | `BucklingY` | Number (list) | Flexural buckling about local *y* — the minor axis of an I (6.3.1). Zero when the beam is not in compression. |
| BucklingZ | `BucklingZ` | Number (list) | Flexural buckling about local *z* — the major axis of an I (6.3.1). |
| Max | `Max` | Number (list) | The largest of the above. Empty when a check that applies could not be made. |
| Element | `Element` | Element (list) | The beams checked. |

### Design menu

Below the component, folded away until you open it. Its inputs are set once per project and then
left alone; its outputs say more about a beam than how loaded it is.

| Input | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Fabrication | `Fabrication` | Text | `Rolled` | `Rolled` — rolled I-sections and hot-finished hollow sections. `Welded` — welded I-sections and cold-formed hollow sections. Sets the buckling curves and an I's shear area. |
| γM0 | `γM0` | Number | `1.0` | Partial factor for the resistance of cross-sections. A National Annex may set another value. |
| γM1 | `γM1` | Number | `1.0` | Partial factor for the resistance of members to instability. A National Annex may set another value. |
| Report | `Report` | Boolean | `false` | Write the **Report** output. Off by default: on a large model the text is most of the work, and off, none of it is written. |

| Output | Nick | Type | Description |
| --- | --- | --- | --- |
| Type | `Type` | Text (list) | What the beam is made of, from its material: `Steel`, or `Unknown` when the material has no design grade. |
| Class | `Class` | Integer (list) | Cross-section class, 1 to 4, the worst along the beam. |
| Governing | `Governing` | Text (list) | Which check gives **Max**, or which checks could not be made. |
| Report | `Report` | Text (list) | Everything worked out on the way — grade, fy, class, section properties, resistances, where each check governs and what is not covered. Put it in a panel to check a member by hand. Empty unless the **Report** input is on. |

{% hint style="danger" %}
**Not checked yet:** lateral-torsional buckling (6.3.2), bending with compression as a member
(6.3.3), torsional and torsional-flexural buckling (6.3.1.4), warping torsion, shear buckling of
slender webs (EN 1993-1-5) and Class 4 sections.

A beam that is not restrained laterally, or a member in **compression and bending**, is not
verified by this component alone.
{% endhint %}

## 💡 Where the steel grade comes from

From the beam's **material**. Make it with [Material Database](../materials/MaterialDatabase.md),
which stamps the grade on it, or give a [Uniaxial](../materials/Uniaxial.md) material the name
of its grade: `S355`, `S355JR`, `s355 j2` and `S 355` are all S355. A material with any other
name is `Unknown` and is left unchecked, with a warning.

fy follows EN 1993-1-1 **Table 3.1** for the section's thickest plate, including the lower value
for plates thicker than 40 mm:

| Grade | t ≤ 40 mm | 40 < t ≤ 80 mm |
| --- | --- | --- |
| S235 | 235 | 215 |
| S275 | 275 | 255 |
| S355 | 355 | 335 |
| S450 | 440 | 410 |

## 💡 Axes

Alpaca4d's local axes, as in [Beam Forces](beam-forces.md): local *y* along the depth of the
section as drawn, local *z* across it. For an I that makes **bending about z the major axis** —
EN 1993-1-1's y-y — and **ShearY** the shear along the web. So `BendingZ` and `BucklingZ` are the
major axis of an I, `BendingY` and `BucklingY` the minor.

## 💡 What is checked

| Check | Clause | How |
| --- | --- | --- |
| Class | 5.5, Table 5.2 | Every flange, web and wall, for the stress it carries at each integration point |
| Axial | 6.2.3, 6.2.4 | N / (A fy/γM0) |
| Shear | 6.2.6, 6.2.7(9) | V / (Av fy/√3/γM0), the shear area from 6.2.6(3), reduced for the torsional shear stress |
| Torsion | 6.2.7 | τt / (fy/√3/γM0), St. Venant — the only torsion the analysis has |
| Bending | 6.2.5, 6.2.8 | M / (W fy/γM0): Wpl for Class 1 and 2, Wel for Class 3. Past half the shear resistance, fy is reduced over the shear area — (6.30) for an I |
| Combined | 6.2.9, 6.2.10 | Class 1 and 2: the reduced plastic moments M_N,Rd and the biaxial criterion (6.41), with the exponents of the shape. Class 3: the largest direct stress against fy/γM0 |
| Buckling | 6.3.1 | N / (χ A fy/γM1) about each axis, for the largest compression along the beam, with the buckling curve of Table 6.2 |

Every cross-section check is made at **every integration point** — five along a beam — and the
worst is reported; the **Report** says where.

The reduced plastic moments by shape:

| Section | M_N,Rd | Exponents in (6.41) |
| --- | --- | --- |
| [I Section](../sections/h-section.md), equal flanges | (6.36) to (6.38) | 2 on Mz, 5n ≥ 1 on My |
| [Rectangular Hollow](../sections/rectangular-hollow.md), uniform walls | (6.39), (6.40) | 1.66 / (1 − 1.13n²) ≤ 6 |
| [Circular](../sections/circular.md), tube or bar | M_pl (1 − n^1.7) | 2 |
| [Rectangular](../sections/rectangular.md) | M_pl (1 − n²) | 1 |
| Unequal I, uneven box, [Double L-Angle](../sections/double-angle.md) | none given | the linear sum of 6.2.1(7) |

{% hint style="info" %}
**Combined** is reported as the largest of each moment over its reduced resistance and the
left-hand side of (6.41). It is ≤ 1 exactly when (6.41) holds — but where (6.41) alone would turn a
member at 90% of its reduced moment into 0.81 (an exponent of 2), this reads 0.9. Some tools report
the left-hand side alone, so their number can be lower for the same member.
{% endhint %}

## 💡 Buckling curves

Table 6.2, from the shape and **Fabrication** — `Rolled` picks the rolled I and hot-finished rows,
`Welded` the welded I and cold-formed ones:

| Section | Major axis | Minor axis |
| --- | --- | --- |
| Rolled I, h/b > 1.2, tf ≤ 40 mm | a | b |
| Rolled I, h/b > 1.2, 40 < tf ≤ 100 mm | b | c |
| Rolled I, h/b ≤ 1.2, tf ≤ 100 mm | b | c |
| Rolled I, h/b ≤ 1.2, tf > 100 mm | d | d |
| Welded I, tf ≤ 40 mm | b | c |
| Welded I, tf > 40 mm | c | d |
| Hollow, rectangular or circular, hot finished | a | a |
| Hollow, cold formed | c | c |
| Solid bar, rectangular or round | c | c |
| Double L-Angle | b | b |

From fy = 460 N/mm² the rolled I and hot-finished rows take Table 6.2's S460 column instead —
a0, a or c. An I with **unequal flanges** takes the welded rows whatever **Fabrication** says — nobody rolls
one.

Buckling may be ignored where λ̄ ≤ 0.2 or N_Ed ≤ 0.04 N_cr (6.3.1.2(4)); the check then reads the
cross-section's compression at γM1.

## ⚠️ Class 4, and checks that could not be made

**Class 3 at low stress.** A part that fails the Class 3 limit is given the second chance of
**5.5.2(9)**: it is Class 3 after all if it meets the limit with ε raised by √(fy/γM0 / σcom,Ed),
σcom,Ed the compression it actually carries. Without it, every point of a slender I where the moment
passes through zero would read as Class 4 under the slightest axial force — the web of an IPE 300 in
S355 is Class 4 in pure compression. Such a section is checked elastically, and the component says so
with a remark.

**Class 4.** A section still Class 4 after that needs the effective properties of EN 1993-1-5, which
are not worked out yet. The beam is **not checked at all** — its outputs are empty — and the
component warns.

**Class 4 for buckling only.** 5.5.2(10) forbids the second chance for member buckling, which is
classified by Table 5.2 alone. A beam whose section is Class 4 in compression gets its cross-section
checks, but its **buckling is not checked** unless N_Ed ≤ 0.04 N_cr — and then **Max is empty** and
**Governing** reads `Not checked: BucklingY, BucklingZ`. A largest value over the checks that were
made would read as a verdict on the beam, and it is not one.

The component's messages:

| Message | Level | Means |
| --- | --- | --- |
| *... have a material with no design grade and are not checked* | Warning | **Type** is `Unknown`. Give the material a grade. |
| *... are Class 4 and are not checked at all* | Warning | The section is Class 4 even at the stress it carries. Outputs empty. |
| *... are Class 4 in compression, so their flexural buckling is not checked and Max is empty* | Warning | Cross-section checked, buckling not. |
| *... use a section with no shape* | Warning | A [Generic Section](../sections/parametric-cross-section.md): no plates to check. |
| *... have checks that could not be made, so no Max* | Warning | Anything else missing — see the **Report**. |
| *... taken as Class 3 under 5.5.2(9)* | Remark | Checked, elastically, at the low stress the part carries. |

## 💡 Sharp corners

The check uses the section the analysis used. An [I Section](../sections/h-section.md) — including
the [Steel Section Library](../sections/library.md) profiles — has **no root radius**, and a hollow
section no corner radius. Against a rolled catalogue section that makes A and Wpl a few percent low
(an IPE 300's Wpl,y is 602 cm³ against the catalogue's 628) and a web's c/t a little high: all on the
safe side. Box walls are classified on their flat width h − 3t, as the section tables do for
hot-finished tubes.

## 📈 When to use it

**Use it when**

- You want to know whether steel members are big enough, and which check governs.
- You are sizing members: feed **Max** back into a section choice.

**Do not use it when**

- The member is laterally unrestrained, or in compression and bending → check 6.3.2 and 6.3.3
  yourself; this component does not yet.
- You only want the stresses → [Beam Stresses](beam-stresses.md).

## ✅ How it is checked

The rules are set against published worked examples, each in its own units and to the digits
printed:

| Source | Member | Checked |
| --- | --- | --- |
| JRC 2014, *Eurocodes — Design of steel buildings with worked examples*, Example 1 | HEB 340 column, S355 | class, N_c,Rd, λ̄, curves, χ, N_b,Rd |
| ibid., Example 2 | IPE 400 beam, S355 | class, M_pl,Rd, V_pl,Rd, shear area, shear buckling limit |
| Gardner & Nethercot, *Designers' Guide to EN 1993-1-1*, Example 6.6 | UKB 457×191×98, S275 | class, N_pl,Rd, M_pl,Rd, M_N,y,Rd |
| ibid., Example 6.7 | CHS 244.5×10 column, S355 | **end to end through Alpaca4d's own section**: class, N_cr, λ̄, χ, N_b,Rd, utilisation 0.71 |
| Structville, *Design of steel columns for biaxial bending* | UKC 254×254×89, S275 | M_N,y,Rd, M_N,z,Rd, β, (6.41), χ |

Then every shape against hand formulas, members worked by hand, and the whole chain — a recorder
file solved by OpenSees, read and checked.
