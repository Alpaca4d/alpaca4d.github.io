# Beam With Hinges

A **beam with hinges** is a frame element whose inelastic behaviour is confined to two hinge
zones at the ends. The interior stays linear elastic, and `HingeRadau` integration puts the
end integration points inside the hinge lengths.

Alpaca4d builds the hinge by taking the element's own section and scaling the stiffness of
each **released** degree of freedom by 10⁻⁶ — so a release is a very soft hinge section, not
a true free end.

## 🔧 Grasshopper component

`ForceBeamColumn (Alpaca4d)` — **Alpaca4d ▸ 02_Element**

There is no separate component. Right-click the **ForceBeamColumn** component and set the
**Element Type** menu to **WithHinges**.

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Line | `Line` | Curve | — | Centreline of the element, in `m`. |
| Section | `Section` | Section | — | Interior cross-section. Also the section the hinges are derived from. |
| GeometricTransformation | `GeomTransf` | Generic | Linear | Geometric transformation. If left empty a **Linear** transformation is built from the line and `ZAxis`. |
| ReleaseI | `ReleaseI` | Release | fully fixed | Release condition at the **I** end, from [Hinge Release](hinge-release.md). |
| LpI | `LpI` | Number | `0.05` | Hinge length at the **I** end, **as a fraction of the element length L**. |
| ReleaseJ | `ReleaseJ` | Release | fully fixed | Release condition at the **J** end. |
| LpJ | `LpJ` | Number | `0.05` | Hinge length at the **J** end, as a fraction of L. |
| ZAxis | `ZAxis` | Vector | perpendicular frame | Local *z* axis of the element. |
| Colour | `Colour` | Colour | Alpaca4d hinged-beam colour | Display colour in the Rhino viewport. |

{% hint style="warning" %}
**LpI and LpJ are ratios, not lengths.** `0.05` means 5 % of the chord length L, whatever
units the model is drawn in. Empty or non-positive values fall back to `0.05`; anything else
is clamped to **\[0.02, 0.10]**.

The clamp is not cosmetic. `HingeRadau` gives the two interior points a weight of
`0.5 - 2(lpI + lpJ)/L`, so `lpI + lpJ` has to stay below `L/4`; capping each end at `0.10`
keeps that weight at 0.30 or above. And below `0.02` the 10⁻⁶ softening no longer reads as a
release, because the released flexibility scales with `lp/L`.
{% endhint %}

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Element | `Element` | Element | Beam element, to be connected to [Assemble](../assemble.md). |

## 📈 When to use it

**Use it when**

- Inelastic deformation is expected at known locations — the ends of beams and columns in a
  moment frame under seismic or pushover loading.
- You need to release specific DOFs at a member end (a pinned connection, a moment release)
  while keeping the rest of the member elastic.
- You want something lighter than a fibre model along the whole member.

**Do not use it when**

- Yielding may develop anywhere along the span → use a plain
  [ForceBeamColumn](force-beam-column.md).
- You need moment or curvature resolved inside the elastic interior.
- The plastic hinge length is uncertain — results are sensitive to it.

## 🔗 Relation to OpenSees

A `forceBeamColumn` with an inline `HingeRadau` specification:

```tcl
element forceBeamColumn $eleTag $iNode $jNode $transfTag \
        HingeRadau $secTagI $lpI $secTagJ $lpJ $secTagC -mass $massDens
```

- `$secTagI` / `$secTagJ` — auto-generated elastic sections for the hinge zones. Released
  DOFs have their stiffness scaled by 10⁻⁶.
- `$lpI` / `$lpJ` — the **absolute** hinge lengths, computed as `ratio × L` from the LpI/LpJ
  inputs.
- `$secTagC` — the interior elastic section, i.e. the **Section** input.
- `$massDens` — mass per unit length, from the section area times the material density.

The mapping from the release booleans to the softened section property is:

| Release input | Section property scaled |
| --- | --- |
| `Tx` | Area |
| `Ty` | AlphaY |
| `Tz` | AlphaZ |
| `Rx` | J |
| `My` | Iyy |
| `Mz` | Izz |
