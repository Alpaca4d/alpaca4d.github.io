# Steel01

Bilinear steel with **kinematic hardening**: elastic to yield, then a straight
strain-hardening branch.

## 🔧 In Grasshopper

A law of the [Steel](steel.md) component: pick **Steel01** in its **Law** menu. Its inputs and defaults are under [Inputs — Steel01](steel.md#inputs-steel01).

{% hint style="warning" %}
`a1` to `a4` are **one optional group of four**. Give all four or leave all four empty — a
partly filled set is an error, not a silent default.
{% endhint %}

## 📈 When to use it

**Use it when**

- You are modelling structural steel in a fibre section — a steel beam, a composite section,
  an embedded plate.
- A bilinear idealisation is enough, which for structural steel it usually is.

**Do not use it when**

- The fibre is a reinforcing bar → [ReinforcingSteel](reinforcing-steel.md) models the yield
  plateau and the curved hardening branch that bars actually have.
- You need the rounded Bauschinger transition of a cyclic response — `Steel01` has a sharp
  corner. **Steel02**, in the same [Steel](steel.md) component's Law menu, has it.

## 🔗 Relation to OpenSees

```tcl
uniaxialMaterial Steel01 $matTag $Fy $E0 $b <$a1 $a2 $a3 $a4>
```
