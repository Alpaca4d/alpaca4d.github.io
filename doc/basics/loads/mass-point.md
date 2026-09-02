# ⚖️ Mass Point

Adds **mass at a node** without adding a force. It is how you represent something that has
weight in a dynamic analysis but is not modelled as an element: a tank of water, plant on a
roof, a façade, the participating fraction of an imposed load.

## 🔧 Grasshopper component

`Mass Point (Alpaca4d)` — **Alpaca4d ▸ 05_Load**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Point | `Point` | Point | — | Where the mass sits. Matched to the nearest node within the [Assemble](../assemble.md) tolerance. |
| TransMass | `TransMass` | Vector | — | Translational mass, one component per global axis. |
| RotationalMass | `RotationalMass` | Vector | `0, 0, 0` | Rotational mass (mass moment of inertia) about each global axis. Only written when the node has 6 DOF. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Load | `Load` | Load | Mass load. Connect it **directly** to Assemble's `LoadPatterns` input — it does not need a [Load Pattern](load-pattern.md). |

{% hint style="info" %}
The input is in **kg**, and is converted to the solver's mass unit when the deck is written —
the same conversion an element's mass density goes through. Added mass and element self-mass
are therefore on the same footing, and you can check that by reading
**TotalMassOfStructure** from the [Modal Analysis Report](../results/modal-analysis-report.md).

Before 0.11 this input carried a stray factor of 9.81, which made every point mass 9.81 times
too heavy and any model relying on it report periods about 3.1 times too long. If you have a
model calibrated against that behaviour, its periods will now drop.
{% endhint %}

## 📈 When to use it

**Use it when**

- You are running [Natural Vibration](../analysis/natural-vibration.md) or a transient
  analysis, and some of the inertia is not in the elements.
- You are lumping a secondary system — equipment, a tank, cladding — onto the primary
  structure.

**Do not use it when**

- You want a static force → use [Point Load](point-load.md). Mass alone produces no static
  action.
- The self-weight of the modelled elements is what you are after → that comes from the
  material density, applied by [Gravity Load](gravity.md).

## 🔗 Relation to OpenSees

```tcl
mass $nodeTag $mx $my $mz $mrx $mry $mrz    ;# 6 DOF node
mass $nodeTag $mx $my $mz                   ;# 3 DOF node
```

The rotational terms are dropped on a 3 DOF node — a node belonging only to bricks or
tetrahedra.
