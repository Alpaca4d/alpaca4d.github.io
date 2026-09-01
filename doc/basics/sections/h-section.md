# I Section

An I-shaped (H-shaped) cross-section, allowed to be **asymmetric**: the top and bottom
flanges have independent widths and thicknesses.

## 🔧 Grasshopper component

`I Section (Alpaca4d)` — **Alpaca4d ▸ 01_Section**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| SectionName | `SecName` | Text | *(empty)* | Label for the section. |
| Height | `Height` | Number | `0.3` | Overall height, in `m`. |
| TopFlangeWidth | `TopFlangeWidth` | Number | `0.15` | Width of the top flange, in `m`. |
| TopFlangeThickness | `TopFlangeThickness` | Number | `0.02` | Thickness of the top flange, in `m`. |
| BottomFlangeWidth | `BottomFlangeWidth` | Number | `0.20` | Width of the bottom flange, in `m`. |
| BottomFlangeThickness | `BottomFlangeThickness` | Number | `0.02` | Thickness of the bottom flange, in `m`. |
| Web | `Web` | Number | `0.02` | Web thickness, in `m`. |
| Material | `Material` | Material | — | A [Uniaxial](../materials/Uniaxial.md) material. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Section | `Section` | Section | Beam section, for a [ForceBeamColumn](../elements/force-beam-column.md). |

## 📈 When to use it

**Use it when**

- The member is a welded plate girder, or any I-profile that is not in the catalogue.
- The section is **monosymmetric** — a composite beam approximated with a wide bottom
  flange, a crane girder.

**Do not use it when**

- The profile is a rolled IPE, HEA, HEB or similar → [Steel Section Library](library.md),
  family `I`, which has 90 of them and gets the root radii right.

## 🔗 Relation to OpenSees

```tcl
section Elastic $secTag $E $A $Izz $Iyy $G $J $alphaY $alphaZ
```
