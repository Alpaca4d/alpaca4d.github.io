# Force Beam Column

A **force beam column** is a frame element with a force-based (flexibility) formulation.
The section response is integrated along the member, so the element captures the real
distribution of curvature along the span rather than assuming a shape function for it.

## 🔧 Grasshopper component

`ForceBeamColumn (Alpaca4d)` — **Alpaca4d ▸ 02_Element**

A switcher component. The **Element Type** menu selects the unit:

- **ForceBeamColumn** — a plain force-based beam, described here.
- **WithHinges** — the same element with plastic hinge zones at the ends, described in
  [Beam With Hinges](beam-with-hinges.md).

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Line | `Line` | Curve | — | Centreline of the element, in `m`. |
| Section | `Section` | Section | — | Cross-section, from any of the [Sections](../sections/README.md) components. Carries the material, and with it the mass density. |
| GeometricTransformation | `GeomTransf` | Generic | Linear | Geometric transformation. If left empty a **Linear** transformation is built from the line and `ZAxis`. |
| ZAxis | `ZAxis` | Vector | perpendicular frame | Local *z* axis of the element. If left empty Alpaca4d derives one from the line direction. |
| Colour | `Colour` | Colour | Alpaca4d beam colour | Display colour in the Rhino viewport. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Element | `Element` | Element | Beam element, to be connected to [Assemble](../assemble.md). |

## 📈 When to use it

**Use it when**

- You are modelling any line-like member: beams, columns, braces, truss bars.
- You want the spread of yielding along the member length to be captured.
- You need realistic curvature and rotation demands for pushover or seismic work.

**Do not use it when**

- Inelasticity is confined to the member ends and you would rather control the hinge length
  explicitly → switch the unit to **WithHinges**.
- The member is really a surface or a solid → use [Shell](shell.md) or [Brick](brick.md).

## 🔗 Relation to OpenSees

The component writes a `geomTransf` and a `forceBeamColumn`:

```tcl
geomTransf Linear $transfTag $zx $zy $zz
element forceBeamColumn $eleTag $iNode $jNode $transfTag NewtonCotes $secTag 5 -mass $massDens
```

- The integration is **Newton–Cotes with 5 points**, created automatically.
- `$secTag` comes from the **Section** input.
- `$massDens` is mass per unit length, from the section area times the material density.
- Transformation and integration tags are numbered automatically per element.
