# Generic Section

A section defined by its **stiffness properties directly**, with no geometry behind them.
Use it when the properties come from somewhere else: a homogenised deck, a section computed
in another tool, a value taken from a catalogue table.

## 🔧 Grasshopper component

`Generic Section (Alpaca4d)` — **Alpaca4d ▸ 01_Section**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| SectionName | `SecName` | Text | *(empty)* | Label for the section. |
| Area | `A` | Number | — | Cross-sectional area, in `m²`. |
| Izz | `Izz` | Number | — | Second moment of area about the local *z* axis, in `m⁴`. |
| Iyy | `Iyy` | Number | — | Second moment of area about the local *y* axis, in `m⁴`. |
| J | `J` | Number | — | Torsion constant, in `m⁴`. |
| AlphaY | `AlphaY` | Number | — | Shear area factor along the local *y* axis. |
| AlphaZ | `AlphaZ` | Number | — | Shear area factor along the local *z* axis. |
| Material | `Material` | Material | — | A [Uniaxial](../materials/Uniaxial.md) material, supplying `E`, `G` and the density used for element mass. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Section | `Section` | Section | Beam section, for a [ForceBeamColumn](../elements/force-beam-column.md). |

## 📈 When to use it

**Use it when**

- The properties were computed elsewhere and you want them used verbatim.
- You are homogenising something — a ribbed deck, a built-up member, a stiffened panel
  reduced to an equivalent beam.
- You want to run a sensitivity study on `Izz` alone, without re-deriving a geometry.

**Do not use it when**

- A parametric section describes the member → use it, and the extruded preview in
  [Model View](../visualisation/model-view.md) will show you the real shape.

{% hint style="warning" %}
The area you give also sets the **element mass**, as `A × ρ`. If you enter a reduced or
effective area, the mass goes with it — which matters for
[Natural Vibration](../analysis/natural-vibration.md) and any dynamic run.
{% endhint %}

## 🔗 Relation to OpenSees

```tcl
section Elastic $secTag $E $A $Izz $Iyy $G $J $alphaY $alphaZ
```

Every input maps straight through.
