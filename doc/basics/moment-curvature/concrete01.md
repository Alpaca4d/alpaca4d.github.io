# Concrete01

Concrete with **zero tensile strength**: a parabolic rise to the peak, a linear descent to a
crushing plateau, and nothing at all in tension.

## 🔧 In Grasshopper

A law of the [Concrete](concrete.md) component: pick **Concrete01** in its **Law** menu. Its inputs and defaults are under [Inputs — Concrete01](concrete.md#inputs-concrete01).

{% hint style="warning" %}
**Every stress and strain here is negative.** Compression negative is the OpenSees convention
for `Concrete01`, and entering `25000` instead of `-25000` gives a section that behaves
backwards without any error.
{% endhint %}

## 📈 When to use it

**Use it when**

- You are modelling the concrete part of a reinforced-concrete section.
- You want the cracking and the crushing to come out of the analysis rather than be assumed.

**Do not use it when**

- You need tensile strength — `Concrete01` has none, which is conservative for flexure but
  wrong for anything relying on tension stiffening. **Concrete02** and **Concrete04**, in the
  same [Concrete](concrete.md) component's Law menu, have it.
- You need confinement modelled explicitly. You can approximate it by giving the core patch
  a higher `fcu` and a larger `EpsilonCu` than the cover.

## 💡 MinMax

With **MinMax** on, a fibre that strains past `EpsilonCu` stops carrying stress permanently,
which is what physically happens when concrete crushes. Off, the material follows its curve
indefinitely and the moment–curvature curve keeps a residual capacity it should not have.

Turn it on for anything you intend to read a failure point off.

## 🔗 Relation to OpenSees

```tcl
uniaxialMaterial Concrete01 $matTag $fpc $epsc0 $fpcu $epscU
uniaxialMaterial MinMax     $wrapTag $matTag -min $minStrain -max $maxStrain
```

The `MinMax` wrapper is written only when the **MinMax** input is `true`, and the fibres then
reference the wrapper's tag.
