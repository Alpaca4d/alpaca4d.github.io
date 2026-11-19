# Other Laws

A law that is neither concrete nor steel, for the fibres of a section: a spring-like material, a fibre laminate or a tendon, a timber or masonry backbone, anything with its own curve. The **Law** menu (right click the component) picks one; the inputs change with it. Stresses in `kN/m²`, strains dimensionless.

## 🔧 Grasshopper component

`Other Laws (Alpaca4d)` — **Alpaca4d ▸ MomentCurvature_βeta**

<figure><img src="../../.gitbook/assets/components/other-laws.png" alt="OtherLaws component" width="363"><figcaption></figcaption></figure>

### Laws

| Law | Models |
| --- | --- |
| **ElasticPP** | Elastic, then perfectly plastic (the default). |
| **Elastic** | Linear, to a rupture strain if you give one: a carbon or glass fibre laminate, a tendon. |
| **Hysteretic** | A bilinear or trilinear backbone, each side of its own, with pinching and damage. |

### Inputs — ElasticPP

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Material Name | `MatName` | Text | `ElasticPP` | Label for the material. |
| E | `E` | Number | `210000000` | Elastic modulus, in `kN/m²`. |
| epsyP | `epsyP` | Number | `0.0017` | Yield strain in tension. Positive. 0.0017 is S355. |
| epsyN | `epsyN` | Number | *(empty)* | Yield strain in compression. Negative. Empty mirrors `epsyP`. |
| eps0 | `eps0` | Number | *(empty)* | Strain at zero stress to start from. Empty for none. |

### Inputs — Elastic

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Material Name | `MatName` | Text | `Elastic` | Label for the material. |
| E | `E` | Number | `160000000` | Elastic modulus, in `kN/m²`. 160 GPa is a carbon fibre laminate. |
| Eneg | `Eneg` | Number | *(empty)* | Elastic modulus in compression, in `kN/m²`. Empty: the same as `E`. |
| RuptureTension | `RuptureTension` | Number | `0.017` | Strain at rupture in tension. Positive. Empty for none. 0.017 is a carbon fibre laminate. |
| RuptureCompression | `RuptureCompression` | Number | *(empty)* | Strain at rupture in compression. Positive. Empty for none. |

### Inputs — Hysteretic

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Material Name | `MatName` | Text | `Hysteretic` | Label for the material. |
| e1p | `e1p` | Number | `0.00169` | Strain at the first point of the backbone in tension. Positive. |
| s1p | `s1p` | Number | `355000` | Stress at the first point in tension, in `kN/m²`. Positive. |
| e2p | `e2p` | Number | `0.05` | Strain at the second point in tension. |
| s2p | `s2p` | Number | `450000` | Stress at the second point in tension, in `kN/m²`. |
| e3p | `e3p` | Number | *(empty)* | Strain at a third point in tension. Empty for a bilinear backbone. Give it with `s3p`. |
| s3p | `s3p` | Number | *(empty)* | Stress at a third point in tension, in `kN/m²`. Give it with `e3p`. |
| e1n | `e1n` | Number | *(empty)* | Strain at the first point in compression. Negative. Empty: the compression side mirrors the tension side, all of it. |
| s1n | `s1n` | Number | *(empty)* | Stress at the first point in compression, in `kN/m²`. Negative. |
| e2n | `e2n` | Number | *(empty)* | Strain at the second point in compression. Negative. |
| s2n | `s2n` | Number | *(empty)* | Stress at the second point in compression, in `kN/m²`. Negative. |
| e3n | `e3n` | Number | *(empty)* | Strain at a third point in compression. Negative. Give it with `s3n`, and only if there is one in tension. |
| s3n | `s3n` | Number | *(empty)* | Stress at a third point in compression, in `kN/m²`. Negative. |
| pinchX | `pinchX` | Number | `1` | Pinching of strain during reloading, 0 to 1. 1 is none. |
| pinchY | `pinchY` | Number | `1` | Pinching of stress during reloading, 0 to 1. 1 is none. |
| damage1 | `damage1` | Number | `0` | Damage from ductility. |
| damage2 | `damage2` | Number | `0` | Damage from energy. |
| beta | `beta` | Number | *(empty)* | Power of the degrading unloading stiffness. Empty for none. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Material | `Material` | Material | Uniaxial material, for a [Patch](patch.md), [Layer](layer.md) or [Fiber Point](fiber-point.md) of a [Fiber Section](fiber-section.md). |

A Hysteretic backbone gives a strain and a stress for each point, two or three, rising; leave the
compression side empty and it mirrors the tension side, otherwise give as many points as the
tension side has.

An Elastic law with a rupture strain is wrapped in a `MinMax` material, so a fibre past it carries
nothing more: the end of a laminate's or a tendon's curve.

The Interaction Domain and Moment Curvature read the first point of the backbone, or `epsyP`, as
the law's yield.

## 🔗 Relation to OpenSees

```tcl
uniaxialMaterial ElasticPP  $matTag $E $epsyP <$epsyN <$eps0>>
uniaxialMaterial Elastic    $matTag $E <0 $Eneg>
uniaxialMaterial Hysteretic $matTag $s1p $e1p $s2p $e2p <$s3p $e3p> $s1n $e1n $s2n $e2n <$s3n $e3n> $pinchX $pinchY $damage1 $damage2 <$beta>
uniaxialMaterial MinMax     $wrapTag $matTag -min $minStrain -max $maxStrain
```
