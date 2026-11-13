# Steel01

Bilinear steel with **kinematic hardening**: elastic to yield, then a straight
strain-hardening branch.

## 🔧 Grasshopper component

`Steel01 (Alpaca4d)` — **Alpaca4d ▸ MomentCurvature_βeta**

### Inputs

Defaults are **S355**.

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Material Name | `MatName` | Text | `S355` | Label for the material. |
| fy | `fy` | Number | `355000` | Yield strength, in `kN/m²`. |
| E0 | `E0` | Number | `210000000` | Initial elastic modulus, in `kN/m²`. |
| b | `b` | Number | `0.01` | Strain-hardening ratio: the post-yield tangent divided by `E0`. |
| a1 | `a1` | Number | *(none)* | Isotropic hardening in compression. |
| a2 | `a2` | Number | *(none)* | Compression hardening limit. |
| a3 | `a3` | Number | *(none)* | Isotropic hardening in tension. |
| a4 | `a4` | Number | *(none)* | Tension hardening limit. |

{% hint style="warning" %}
`a1` to `a4` are **one optional group of four**. Give all four or leave all four empty — a
partly filled set is an error, not a silent default.
{% endhint %}

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Material | `Material` | Material | Uniaxial material, for a [Patch](patch.md), [Layer](layer.md) or [Fiber Point](fiber-point.md). |

## 📈 When to use it

**Use it when**

- You are modelling structural steel in a fibre section — a steel beam, a composite section,
  an embedded plate.
- A bilinear idealisation is enough, which for structural steel it usually is.

**Do not use it when**

- The fibre is a reinforcing bar → [ReinforcingSteel](reinforcing-steel.md) models the yield
  plateau and the curved hardening branch that bars actually have.
- You need the rounded Bauschinger transition of a cyclic response — `Steel01` has a sharp
  corner. `Steel02` would, but is not exposed.

## 🔗 Relation to OpenSees

```tcl
uniaxialMaterial Steel01 $matTag $Fy $E0 $b <$a1 $a2 $a3 $a4>
```
