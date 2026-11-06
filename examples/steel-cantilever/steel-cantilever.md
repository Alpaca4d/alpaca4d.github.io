# 🔩 Steel Cantilever

<figure><img src="https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/refs/heads/main/doc/examples/steel-cantilever/steel-cantilever.png" alt="A 4 m steel cantilever and its utilisations: an HEA 200 passes at 0.89, an IPE 300 of the same weight fails lateral-torsional buckling at 1.11"><figcaption></figcaption></figure>

[steel-cantilever](https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/main/doc/examples/steel-cantilever/steel-cantilever.gh)

A 4 m steel cantilever, built in at its root, carrying its own weight and 15 kN at its tip, checked
to EN 1993-1-1 with [Utilisation](../../basics/results/utilisation.md). It shows how to set up a
member so that Utilisation can check it, what a cantilever needs that a beam held at both ends does
not, and how to read the result.

{% hint style="info" %}
The example needs a version of Alpaca4d whose Utilisation has the **LengthLT** input, for
lateral-torsional buckling.
{% endhint %}

## The model

| Group | What it does |
| --- | --- |
| 1 - The cantilever | **Length**, **Tip load**, **Section** and **Grade**: the four things to try. |
| 2 - Geometry | A line along X, from the root at the origin to the tip. |
| 3 - Member | [Material Library Elastic](../../basics/materials/MaterialDatabase.md) makes S355, and stamps the grade on the material: that is how Utilisation knows the beam is steel, and its fy. [Steel Section Library](../../basics/sections/library.md) gives the HEA 200. The [Force Beam Column](../../basics/elements/force-beam-column.md) has no ZAxis, so its local y points up: the depth of the I is vertical, and the tip load bends it about its major axis. |
| 4 - Support and loads | Built in at the root, all six restrained. A [Point Load](../../basics/loads/point-load.md) at the tip and [Gravity](../../basics/loads/gravity.md), in one [Load Pattern](../../basics/loads/load-pattern.md). |
| 5 - Analysis | [Run Analysis](../../basics/analysis/run-analysis.md) with the default settings: one step, to the full load. |
| 6 - Utilisation | The check, and panels for what it gives. |

## Using Utilisation

1. **AlpacaModel** comes from Run Analysis, not from Assemble Model: the check reads the forces
   the analysis recorded. **Step** is left at 0, the one step.
2. **LengthY**, **LengthZ** and **LengthLT** are each twice the length, from an Expression
   `f(L)=2*L`. Left empty, each would be the beam's own length, held at both ends - and a
   cantilever's tip is not held at all. 2 L is the flexural buckling length of a cantilever.
   For lateral-torsional buckling, a **LengthLT** longer than the beam stands for an effective
   length, with the root moment taken as uniform over all of it: on the safe side for a root
   built in sideways and against twist.
3. The **Design** menu below the component is open. Its **Report** input is on, and its
   **Governing** and **Class** outputs are wired to panels.
4. **Max** is the largest of the checks, and **Governing** says which one gives it. **Report**
   has every number on the way, to follow the check by hand.

{% hint style="warning" %}
**The lengths are yours to give.** Utilisation cannot know how a member is held. A cantilever, a
sway column or a member drawn as several beams needs its lengths given; see the
[Utilisation](../../basics/results/utilisation.md) page.
{% endhint %}

## What it shows

The HEA 200 and the IPE 300 weigh the same, 42 kg/m. Switch **Section** to compare them:

| Section | Bending (BendingZ) | LTB, lengths 2 L | LTB, lengths left empty | Max |
| --- | --- | --- | --- | --- |
| HEA 200 | 0.48 | **0.89** | 0.52 | 0.89, LTB |
| IPE 300 | 0.30 | **1.11** | 0.38 | 1.11, LTB |
| HEA 240 | 0.28 | 0.46 | 0.28 | 0.46, LTB |

The IPE 300 is the deeper section and the stronger in bending, but its narrow flanges let it buckle
sideways: it fails. Left with its lengths empty, it would have read 0.38 and passed.

The **Report** for the HEA 200 ends:

```
LTB        0.888  L_LT = 8, longer than the member (4): its peak moment taken as uniform over all of it,
           fork supports: M_Ed = 63.145, M_cr = 81.88, λ̄LT = 1.266, curve b (α = 0.34),
           6.3.2.3 (λ̄LT,0 = 0.4, β = 0.75, f = 1), χLT = 0.542, M_b,Rd = 71.115 with W_el
Max 0.888, from LTB
```

M_Ed is the tip load and half the beam's weight times the 4 m arm: (15 + 0.79) × 4 = 63.1 kNm.
The section is Class 3 - its flanges, with no root radius - so the resistance uses W_el.

Try **Length**, **Tip load** and **Grade** too, and watch which check governs.
