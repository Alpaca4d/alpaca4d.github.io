# 📈 Moment Curvature

A **fibre section** divides a cross-section into many small areas, gives each one a uniaxial
material, and integrates their response. It is how a section's real non-linear behaviour —
concrete crushing, reinforcement yielding, the loss of stiffness after cracking — comes out
of the material laws rather than being assumed.

The **Moment Curvature** component then pushes such a section to a given curvature under a
held axial force and returns the full curve.

{% hint style="info" %}
This tab is marked **βeta** in Grasshopper (`MomentCurvature_βeta`). It works as a
section-level tool. Fibre sections cannot yet be assigned to a
[ForceBeamColumn](../elements/force-beam-column.md), which takes an
[elastic section](../sections/README.md).
{% endhint %}

## Components in this tab

**Materials** — non-linear uniaxial laws, for fibres.

| Component | Nickname | Models |
| --- | --- | --- |
| [Concrete01](concrete01.md) | `Concrete` | Concrete with zero tensile strength. |
| [Steel01](steel01.md) | `Steel01` | Bilinear steel with kinematic hardening. |
| [ReinforcingSteel](reinforcing-steel.md) | `ReinforcingSteel` | Reinforcing bar, with a strain-hardening branch. |

**Fibres** — the pieces a section is made of.

| Component | Nickname | Builds |
| --- | --- | --- |
| [Fiber Point](fiber-point.md) | `Fiber Point` | One fibre: a point, an area, a material. |
| [Layer Fiber](layer.md) | `Layer Fiber` | A row of equally spaced fibres along a curve. |
| [Patch](patch.md) | `Patch` | An area filled with fibres, one per mesh face. |
| [Fiber Section](fiber-section.md) | `FiberSection` | Collects points, layers and patches into a section. |

**Analysis**

| Component | Nickname | Does |
| --- | --- | --- |
| [Moment Curvature](moment-curvature.md) | `MC` | Runs the section analysis. |
| [Fiber Stress Strain](fiber-stress-strain.md) | `FBS` | Splits the per-fibre history into fibres, stresses and strains. |

## Local axes and units

Fibre geometry is drawn in the **world XY plane** and read as the section's local *yz* plane:

| Drawn in | Is the section's |
| --- | --- |
| World **X** | Local **y** — the green arrow |
| World **Y** | Local **z** — the blue arrow |

This is the order OpenSees writes a fibre in. [Fiber Section](fiber-section.md) draws both
arrows so you can see which is which.

Everything is in **metres** and **kN**: coordinates in `m`, fibre areas in `m²`, stresses in
`kN/m²`, curvature in `rad/m`, moments in `kN·m`. Strains are dimensionless.

## A typical definition

```
Concrete01 ──► Patch  ─┐
                       ├──► Fiber Section ──► Moment Curvature ──► M, κ
ReinforcingSteel ──► Layer Fiber ─┘                            └──► Fiber Stress Strain
```

1. Mesh the concrete outline and give it to a [Patch](patch.md) with a
   [Concrete01](concrete01.md) material — the mesh density is the fibre density.
2. Draw the bar positions as a curve and give it to a [Layer Fiber](layer.md) with a
   [ReinforcingSteel](reinforcing-steel.md) material.
3. Collect both in a [Fiber Section](fiber-section.md).
4. Push it with [Moment Curvature](moment-curvature.md).
