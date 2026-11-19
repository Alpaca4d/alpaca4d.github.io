# Concrete

A concrete law for the fibres of a section. The **Law** menu (right click the component) picks one; the inputs change with it. The default is Concrete01. Stresses in `kN/m²`, strains dimensionless, **compression negative**.

## 🔧 Grasshopper component

`Concrete (Alpaca4d)` — **Alpaca4d ▸ MomentCurvature_βeta**

<figure><img src="../../.gitbook/assets/components/concrete.png" alt="Concrete component" width="393"><figcaption></figcaption></figure>

### Laws

| Law | Models |
| --- | --- |
| **Concrete01** | A parabola to the peak, a straight fall to the crushing strain, no tension. See [Concrete01](concrete01.md). |
| **Concrete02** | Concrete01's compression with a tensile strength and linear tension softening. |
| **Concrete04** | Popovics' curve, with an exponential tension branch when `fct` and `et` are given. |

Defaults are **C25/30**.

### Inputs — Concrete01

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Material Name | `MatName` | Text | `C25/30` | Label for the material. |
| fco | `fco` | Number | `-25000` | Compressive strength, in `kN/m²`. **Negative.** |
| fcu | `fcu` | Number | `-20000` | Crushing strength at `EpsilonCu`, what is left past the peak, in `kN/m²`. Negative, and no larger in magnitude than `fco`. |
| EpsilonCo | `EpsilonCo` | Number | `-0.002` | Strain at `fco`. Negative, dimensionless. |
| EpsilonCu | `EpsilonCu` | Number | `-0.0035` | Strain at `fcu`. Negative, dimensionless. |
| MinMax | `MinMax` | Boolean | `false` | Wrap the material so a fibre **fails** once its strain leaves the range between `EpsilonCu` and zero. See [MinMax](concrete01.md#minmax). |

### Inputs — Concrete02

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Material Name | `MatName` | Text | `C25/30` | Label for the material. |
| fpc | `fpc` | Number | `-25000` | Compressive strength, in `kN/m²`. Negative. |
| EpsC0 | `EpsC0` | Number | `-0.002` | Strain at `fpc`. Negative, dimensionless. |
| fpcu | `fpcu` | Number | `-20000` | Crushing strength, in `kN/m²`. Negative. |
| EpsU | `EpsU` | Number | `-0.0035` | Strain at the crushing strength. Negative, dimensionless. |
| lambda | `lambda` | Number | `0.2` | Ratio between the unloading slope at `EpsU` and the initial slope. With 0.1 a Moment Curvature analysis can stall as the concrete reaches `EpsU`. |
| ft | `ft` | Number | `2600` | Tensile strength, in `kN/m²`. Positive. |
| Ets | `Ets` | Number | `2000000` | Tension softening stiffness, in `kN/m²`: the slope of the falling branch. Positive. |
| MinMax | `MinMax` | Boolean | `false` | Wrap the material so a fibre **fails** once its strain leaves the range between `EpsU` and zero. |

### Inputs — Concrete04

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Material Name | `MatName` | Text | `C25/30` | Label for the material. |
| fc | `fc` | Number | `-25000` | Compressive strength, in `kN/m²`. Negative. |
| EpsC | `EpsC` | Number | `-0.002` | Strain at `fc`. Negative, dimensionless. |
| EpsCu | `EpsCu` | Number | `-0.0035` | Crushing strain. Negative, dimensionless. |
| Ec | `Ec` | Number | `31000000` | Initial elastic modulus, in `kN/m²`. |
| fct | `fct` | Number | *(empty)* | Tensile strength, in `kN/m²`. Leave empty for no tension. Give it together with `et`. |
| et | `et` | Number | *(empty)* | Strain at the tensile strength, dimensionless. Give it together with `fct`. |
| beta | `beta` | Number | *(empty)* | Exponential decay of the tension branch. Needs `fct` and `et`. Empty takes OpenSees' own. |
| MinMax | `MinMax` | Boolean | `false` | Wrap the material so a fibre **fails** once its strain leaves the range between `EpsCu` and zero. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Material | `Material` | Material | Uniaxial material, for a [Patch](patch.md), [Layer](layer.md) or [Fiber Point](fiber-point.md) of a [Fiber Section](fiber-section.md). |

{% hint style="warning" %}
**Every stress and strain in compression is negative.** Entering `25000` instead of `-25000`
gives a section that behaves backwards without any error.
{% endhint %}

Interaction Domain, Moment Curvature and the plastic hinges of a pushover hold every law to its
crushing strain, as they do Concrete01.

Files saved with the old **Concrete01** component open on this one, on the Concrete01 law.

## 🔗 Relation to OpenSees

```tcl
uniaxialMaterial Concrete01 $matTag $fpc $epsc0 $fpcu $epscU
uniaxialMaterial Concrete02 $matTag $fpc $epsc0 $fpcu $epsU $lambda $ft $Ets
uniaxialMaterial Concrete04 $matTag $fc $epsc $epscu $Ec <$fct $et> <$beta>
uniaxialMaterial MinMax     $wrapTag $matTag -min $minStrain -max $maxStrain
```

The `MinMax` wrapper is written only when the **MinMax** input is `true`, and the fibres then
reference the wrapper's tag.
