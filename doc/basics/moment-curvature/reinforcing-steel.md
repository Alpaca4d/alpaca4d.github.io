# ReinforcingSteel

A reinforcing bar material: elastic to yield, a yield plateau, then a curved strain-hardening
branch up to the ultimate strength.

## 🔧 Grasshopper component

`ReinforcingSteel (Alpaca4d)` — **Alpaca4d ▸ MomentCurvature_βeta**

This is the **default material** for [Fiber Point](fiber-point.md) and
[Layer Fiber](layer.md) — leave their **Material** input empty and they use B450C.

### Inputs

Defaults are **B450C**.

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Material Name | `MatName` | Text | `B450C` | Label for the material. |
| fy | `fy` | Number | `450000` | Yield strength, in `kN/m²`. |
| fu | `fu` | Number | `540000` | Ultimate strength, in `kN/m²`. |
| Es | `Es` | Number | `200000000` | Initial elastic modulus, in `kN/m²`. |
| Esh | `Esh` | Number | `2000000` | Tangent modulus at the onset of strain hardening, in `kN/m²`. Must be greater than zero. |
| esh | `esh` | Number | `0.008` | Strain at the onset of strain hardening. Must be past the yield strain `fy/Es`. |
| eult | `eult` | Number | `0.075` | Strain at `fu`. |
| MinMax | `MinMax` | Boolean | `false` | Wrap the material so a bar **fails** once its strain passes `eult` in either direction. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Material | `Material` | Material | Uniaxial material, for a [Layer](layer.md), [Fiber Point](fiber-point.md) or [Patch](patch.md). |

## 📈 When to use it

**Use it when**

- The fibres are reinforcing bars. The yield plateau and the curved hardening branch are what
  distinguish a bar from a structural steel section, and they set where the
  moment–curvature curve flattens.

**Do not use it when**

- The fibre is structural steel → [Steel01](steel01.md) is simpler and more appropriate.

## 💡 MinMax

With **MinMax** on, a bar that strains past `eult` stops carrying stress — bar rupture. This
is what puts an honest end on a moment–curvature curve; without it the section keeps
resisting after its reinforcement should have broken.

Turn it on, together with [Concrete01](concrete01.md)'s, for any curve you intend to read a
failure point off.

## 🔗 Relation to OpenSees

```tcl
uniaxialMaterial ReinforcingSteel $matTag $fy $fu $Es $Esh $esh $eult
uniaxialMaterial MinMax           $wrapTag $matTag -min $minStrain -max $maxStrain
```
