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

{% hint style="danger" %}
**Check your mass magnitudes against a modal run.** The input is labelled `[kg]`, but the
component scales it by `9.81 / 1000` before writing the OpenSees `mass` command, whereas
element self-mass is scaled by `1 / 1000`. The two are not on the same footing: added mass
comes out a factor of 9.81 larger than element mass for the same physical quantity.

Until this is reconciled, verify any model that mixes added mass with element self-mass by
reading **TotalMassOfStructure** from the
[Modal Analysis Report](../results/modal-analysis-report.md) and comparing it against what
you expect.
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
