# Rectangular

A solid rectangular cross-section.

## 🔧 Grasshopper component

`RectangleCS (Alpaca4d)` — **Alpaca4d ▸ 01_Section**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| SectionName | `SecName` | Text | *(empty)* | Label for the section. Shown by [Model View](../visualisation/model-view.md) when section names are on. |
| Width | `Width` | Number | `0.30` | Width, along the local *z* axis, in `m`. |
| Height | `Height` | Number | `0.60` | Height, along the local *y* axis, in `m`. |
| Material | `Material` | Material | — | A [Uniaxial](../materials/Uniaxial.md) material. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Section | `Section` | Section | Beam section, for a [ForceBeamColumn](../elements/force-beam-column.md). |

## 📈 When to use it

**Use it when**

- The member is a rectangular concrete or timber beam or column.
- You want a simple placeholder while the model is taking shape.

**Do not use it when**

- The profile is a catalogue steel section → [Steel Section Library](library.md).
- You need reinforcement resolved through the depth →
  [Fiber Section](../moment-curvature/fiber-section.md).

## 🔗 Relation to OpenSees

```tcl
section Elastic $secTag $E $A $Izz $Iyy $G $J $alphaY $alphaZ
```

`A`, `Izz`, `Iyy`, `J`, `alphaY` and `alphaZ` are computed from Width and Height; `E` and `G`
come from the material.
