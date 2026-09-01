# Double L-Angle

Two equal L-angles placed back to back with a gap between them — the usual arrangement for a
truss chord or a bracing member bolted through a gusset plate.

## 🔧 Grasshopper component

`2LAngleCS (Alpaca4d)` — **Alpaca4d ▸ 01_Section**, nickname `2L`

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| SectionName | `SecName` | Text | *(empty)* | Label for the section. |
| Height | `Height` | Number | `0.10` | First leg dimension, in `m`. |
| Width | `Width` | Number | `0.10` | Second leg dimension, in `m`. |
| Thickness | `Thickness` | Number | `0.01` | Leg thickness, in `m`. |
| Gap | `Gap` | Number | `0.02` | Clear distance between the two angles, in `m` — typically the gusset plate thickness. |
| Material | `Material` | Material | — | A [Uniaxial](../materials/Uniaxial.md) material. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Section | `Section` | Section | Beam section, for a [ForceBeamColumn](../elements/force-beam-column.md). |

## 📈 When to use it

**Use it when**

- The member is a back-to-back double angle: truss chords and diagonals, bracing, light
  lattice members.

**Do not use it when**

- The profile is a catalogue angle → [Steel Section Library](library.md), family `2L`, which
  has 87 of them and exposes the same **Gap** input.
- The two angles are not connected along their length. This section assumes they act
  compositely; two separate members would be the honest model.

## 🔗 Relation to OpenSees

```tcl
section Elastic $secTag $E $A $Izz $Iyy $G $J $alphaY $alphaZ
```

The properties are those of the **pair**, computed about the combined centroid, with the
angles offset by `Gap/2` either side of the local *z* axis.
