# 🔗 Uniaxial

A **uniaxial material** describes a 1D stress–strain relationship. It is what a beam
cross-section, a fibre or a hinge is made of — anywhere only one stress component matters.

## 🔧 Grasshopper component

`Uniaxial (Alpaca4d)` — **Alpaca4d ▸ 00_Material**

A switcher component. Right-click it to pick the model:

- **UniaxialElastic** — linear elastic, described below.
- **ElasticPerfectlyPlastic** — *not yet implemented*; the unit exists but only issues a
  warning.

### Inputs — UniaxialElastic

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Material Name | `MatName` | Text | *(empty)* | Label for the material, e.g. `S235 – axial`. Cosmetic. |
| E | `E` | Number | `210000000` | Young's modulus in tension, in `kN/m²`. |
| Eneg | `Eneg` | Number | `210000000` | Young's modulus in compression, in `kN/m²`. Equal to `E` unless you need a different one. |
| Eta | `Eta` | Number | `0.0` | Viscous damping parameter. `0.0` for purely elastic behaviour. |
| G | `G` | Number | `90760000` | Shear modulus, in `kN/m²`. |
| ν | `ν` | Number | `0.3` | Poisson's ratio. |
| Rho | `Rho` | Number | `7850` | Density, in `kg/m³`. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Material | `Material` | Material | Uniaxial material, for any [section](../sections/README.md) or fibre. |

{% hint style="info" %}
Only `E`, `Eta` and `Eneg` reach the OpenSees material. `G`, `ν` and `Rho` are used by
Alpaca4d itself — `G` for the section's torsional and shear terms, `Rho` for the element
mass density. That is why they live on the material rather than on the section.
{% endhint %}

## 📈 When to use it

**Use it when**

- You are defining a beam cross-section of any kind.
- You need a fibre material for a [Fiber Section](../moment-curvature/fiber-section.md) and
  elastic behaviour is enough.
- You want a material that is not in the standard grades.

**Do not use it when**

- The element is a shell, brick or tetrahedron → use an [nD material](ND.md).
- You want a standard grade → the [Material Database](MaterialDatabase.md) is faster and
  keeps `E`, `G` and `ρ` consistent.
- You need real non-linearity in a fibre section → use `Concrete01`, `Steel01` or
  `ReinforcingSteel` from [Moment Curvature](../moment-curvature/README.md).

## 🔗 Relation to OpenSees

```tcl
uniaxialMaterial Elastic $matTag $E $eta $Eneg
```
