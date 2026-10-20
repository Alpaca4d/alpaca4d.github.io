# 📈 Moment Curvature

Computes the moment–curvature response of a reinforced-concrete section: a
[Patch](../../basics/moment-curvature/patch.md) of [Concrete01](../../basics/moment-curvature/concrete01.md)
for the concrete, a [Layer Fiber](../../basics/moment-curvature/layer.md) of
[ReinforcingSteel](../../basics/moment-curvature/reinforcing-steel.md) for the bars, collected
into a [Fiber Section](../../basics/moment-curvature/fiber-section.md) and pushed by
[Moment Curvature](../../basics/moment-curvature/moment-curvature.md).

Use it to see how the materials and the reinforcement layout drive stiffness, yield strength
and post-yield behaviour, and as a starting point for section-level studies — M–N
interaction, effective cracked stiffness, ductility.

## What to try

* **Read the ductility.** The curve stops where the first fibre reaches its ultimate strain;
  **κYield**, **κUltimate** and **Ductility** give the section's curvature ductility, and
  **Failure** says which material failed, and where.
* **Sweep the axial force.** Feed a range into **Axial** (negative for compression) and watch the
  ductility fall as the compression grows. For the whole M–N interaction at the ultimate limit
  state use [Interaction Domain](../../basics/moment-curvature/interaction-domain.md) instead.
* **Bend it off its axes.** Give **Direction** an angle, `30` say: the moment holds that direction
  and the neutral axis turns as it needs to.
* **Change the bar count.** `NumberOfFibers` on the Layer Fiber, and watch where the curve
  flattens.
* **Refine the patch mesh.** Each face is one fibre, so the mesh density is the fibre
  density. Compare a coarse and a fine mesh near the neutral axis.
* **Draw the curves.** [Moment Curvature Diagram](../../basics/moment-curvature/moment-curvature-diagram.md)
  draws them, with first yield and the ultimate state marked; wire it several results to compare.
* **Unpack the fibres.** [Fiber Stress Strain](../../basics/moment-curvature/fiber-stress-strain.md)
  gives the stress and strain history of every fibre.

See [Moment Curvature](../../basics/moment-curvature/README.md) for the reference
documentation on each component.

{% hint style="info" %}
Running the definition writes `MomentCurvature.tcl` and a `FiberResults` folder next to the
Grasshopper file, and the materials' curves in `AlpacaResults`. They are analysis artefacts and can
be deleted between runs. The definition was made with the earlier Moment Curvature; Grasshopper
offers to upgrade it when it opens.
{% endhint %}

## Download

[moment-curvature](https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/main/doc/examples/moment-curvature/moment-curvature.gh)
