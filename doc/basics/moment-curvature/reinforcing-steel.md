# ReinforcingSteel

A reinforcing bar material: elastic to yield, a yield plateau, then a curved strain-hardening
branch up to the ultimate strength.

## 🔧 In Grasshopper

A law of the [Steel](steel.md) component: pick **ReinforcingSteel** in its **Law** menu. Its inputs and defaults are under [Inputs — ReinforcingSteel](steel.md#inputs-reinforcingsteel).

It is the **default material** of [Fiber Point](fiber-point.md) and [Layer Fiber](layer.md):
leave their **Material** input empty and they use B450C.

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
