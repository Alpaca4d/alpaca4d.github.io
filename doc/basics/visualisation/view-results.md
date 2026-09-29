# View Results

Draws any result of an analysed model in the viewport: displacements, beam force diagrams,
shell forces, shell stresses, solid stresses and reactions. It shows one result at a time, on
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
