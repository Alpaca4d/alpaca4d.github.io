# Circular

A circular cross-section, solid or hollow.

## 🔧 Grasshopper component

`CircleCS (Alpaca4d)` — **Alpaca4d ▸ 01_Section**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| SectionName | `SecName` | Text | *(empty)* | Label for the section. |
| Diameter | `Diameter` | Number | `0.15` | Outer diameter, in `m`. |
| Thickness | `Thickness` | Number | `0.01` | Wall thickness, in `m`. **`0` or `D/2` gives a solid circle.** Anything larger than `D/2` is an error. |
| Material | `Material` | Material | — | A [Uniaxial](../materials/Uniaxial.md) material. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Section | `Section` | Section | Beam section, for a [ForceBeamColumn](../elements/force-beam-column.md). |

## 📈 When to use it

**Use it when**

- The member is a circular hollow section, a pipe or a tube.
- The member is a solid round bar — set **Thickness** to `0`.

**Do not use it when**

- The profile is a catalogue CHS → [Steel Section Library](library.md), family `O`, which
  has 205 of them.

## 🔗 Relation to OpenSees

```tcl
section Elastic $secTag $E $A $Izz $Iyy $G $J $alphaY $alphaZ
```

For a hollow circle the properties come out as `A = π(D² − (D−2t)²)/4`,
`I = π(D⁴ − (D−2t)⁴)/64` and `J = 2I`.
