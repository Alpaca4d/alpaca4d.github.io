# View Results

Draws any result of an analysed model in the viewport: displacements, beam force diagrams,
beam stresses, shell forces, shell stresses, solid stresses and reactions. It shows one result at a time, on
the undeformed shape or the deformed one.

{% hint style="info" %}
This page is a placeholder. A full reference for the inputs, menus and outputs will follow.
{% endhint %}

## 🔧 Grasshopper component

`View Results_WIP (Alpaca4d)` — **Alpaca4d ▸ 09_Visualisation**

Connect the analysed model from [Run Analysis](../analysis/run-analysis.md) or
[Natural Vibration](../analysis/natural-vibration.md), then pick what to draw from the
**Result** menu on the component body. After a natural vibration analysis, **Step** selects
the mode.

Feed its **Values** and **Colors** outputs to [Legend](legend.md), so the scale matches what is
drawn.

*Beam stresses* colours each beam along its length by any output of
[Beam Stresses](../results/beam-stresses.md) — σN, σMy, σMz, σmax, σmin, τV, τT or Von Mises —
in MPa, with each integration point's colour placed where the point sits on the beam. It is the last entry
of the **Result** menu.

*Beam forces* draws each force as a diagram in the plane it acts in, in the beam's local axes
(turn on **Local Axes** in [Model View](model-view.md) to see them): Vy and Mz across local *y*,
Vz and My across local *z*, N and torsion across local *y*. **Moments are drawn on the tension
side** — on a beam with local *y* up, sagging hangs below it; the other forces are drawn
towards the positive axis. One scale serves the whole model, so the heights compare from one
beam to the next; **Diagram and arrow scale** stretches it. With **Show values** on, each beam's
largest value is written at the tip of its diagram. The signs of the numbers are those
of [Beam Forces](../results/beam-forces.md).

**Extruded beams** draws each beam as its cross-section, on the deformed shape too, coloured by
whatever result is picked.

## 🔁 Instead of the old view components

View Results replaces the separate view components. They are hidden from the ribbon, but
definitions that already use them still open.

| You used | In View Results |
| --- | --- |
| Deformed Model View | *Displacement*, with **Deformed shape** ticked |
| Beam Forces View | *Beam forces* |
| Shell Forces View | *Shell forces* |
| Shell Stresses View | *Shell stresses* |
| Brick Stresses View | *Brick stresses* |
