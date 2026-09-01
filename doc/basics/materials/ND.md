# 🧊 nD

An **nD material** (n-dimensional) describes the full 2D/3D stress–strain law at the Gauss
point of a continuum element. Shells, bricks and tetrahedra all need one.

## 🔧 Grasshopper component

`nD (Alpaca4d)` — **Alpaca4d ▸ 00_Material**

A switcher component. Right-click it to pick the model:

- **ElasticIsotropic** — the same stiffness in every direction.
- **ElasticOrthotropic** — different stiffness along three orthogonal directions, for
  timber, composite panels, or plates that behave differently in-plane and out-of-plane.

### Inputs — ElasticIsotropic

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Material Name | `MatName` | Text | *(empty)* | Label for the material. Cosmetic. |
| E | `E` | Number | `210000000` | Young's modulus, in `kN/m²`. |
| G | `G` | Number | `80760000` | Shear modulus, in `kN/m²`. |
| ν | `ν` | Number | `0.3` | Poisson's ratio. |
| Rho | `Rho` | Number | `7850` | Density, in `kg/m³`. |

### Inputs — ElasticOrthotropic

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Material Name | `MatName` | Text | *(empty)* | Label for the material. Cosmetic. |
| Ex | `Ex` | Number | `210000000` | Young's modulus along *x*, in `kN/m²`. |
| Ey | `Ey` | Number | `210000000` | Young's modulus along *y*, in `kN/m²`. |
| Ez | `Ez` | Number | `210000000` | Young's modulus along *z*, in `kN/m²`. |
| Gxy | `Gxy` | Number | `80760000` | Shear modulus in the *xy* plane, in `kN/m²`. |
| Gyz | `Gyz` | Number | `80760000` | Shear modulus in the *yz* plane, in `kN/m²`. |
| Gzx | `Gzx` | Number | `80760000` | Shear modulus in the *zx* plane, in `kN/m²`. |
| NuXy | `NuXy` | Number | `0.3` | Poisson's ratio *xy*. |
| νYz | `νYz` | Number | `0.3` | Poisson's ratio *yz*. |
| νZx | `νZx` | Number | `0.3` | Poisson's ratio *zx*. |
| Rho | `Rho` | Number | `7850` | Density, in `kg/m³`. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Material | `Material` | Material | nD material, for a [Plate Fiber Section](../sections/plate-fiber.md), an [SSP Brick](../elements/brick.md) or a [Tetrahedron](../elements/four-node-tetrahedron.md). |

{% hint style="info" %}
`G` on the isotropic unit is not written to OpenSees — `ElasticIsotropic` derives its shear
modulus from `E` and `ν`. Alpaca4d keeps `G` on the material because the same material
object may also be read for section properties.
{% endhint %}

## 📈 When to use it

**Use it when**

- The element is a shell, a brick or a tetrahedron.
- You need direction-dependent stiffness — timber panels, laminates, ribbed slabs
  smeared into an orthotropic plate → use **ElasticOrthotropic**.

**Do not use it when**

- The element is a beam → use a [Uniaxial](Uniaxial.md) material.
- You want a standard isotropic grade → the [Material Database](MaterialDatabase.md) will
  produce one directly.

## 🔗 Relation to OpenSees

```tcl
nDMaterial ElasticIsotropic   $matTag $E $nu $rho
nDMaterial ElasticOrthotropic $matTag $Ex $Ey $Ez $nuXy $nuYz $nuZx $Gxy $Gyz $Gzx $rho
```

For the orthotropic material, the local axes are those of the element. On shells, set
**Local X Axis** on the [ASD Shell](../elements/shell.md) component so every face agrees on
which direction `Ex` refers to.
