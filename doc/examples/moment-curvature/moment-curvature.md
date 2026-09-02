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

* **Sweep the axial force.** Feed a range into **Axial** (negative for compression) and take
  the peak moment at each level — that is an M–N interaction diagram.
* **Change the bar count.** `NumberOfFibers` on the Layer Fiber, and watch where the curve
  flattens.
* **Turn `MinMax` on** for both materials, so the curve ends where the section actually
  fails rather than carrying on past it.
* **Refine the patch mesh.** Each face is one fibre, so the mesh density is the fibre
  density. Compare a coarse and a fine mesh near the neutral axis.
* **Unpack the fibres.** [Fiber Stress Strain](../../basics/moment-curvature/fiber-stress-strain.md)
  gives the stress and strain history of every fibre, which is how you find out which one
  failed first and at what curvature.

See [Moment Curvature](../../basics/moment-curvature/README.md) for the reference
documentation on each component.

{% hint style="info" %}
Running the definition writes `MomentCurvature.tcl` and a `FiberResults` folder next to the
Grasshopper file. They are analysis artefacts and can be deleted between runs.
{% endhint %}

## Download

[moment-curvature](https://raw.githubusercontent.com/Alpaca4d/alpaca4d.github.io/main/doc/examples/moment-curvature/moment_curvature.gh)
