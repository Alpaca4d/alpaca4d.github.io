# 🎛️ Sections

A **section** pairs a geometry with a [material](../materials/README.md) and hands the
resulting stiffness properties to an element.

Beam sections are **uniaxial**: they take a [Uniaxial](../materials/Uniaxial.md) material and
reduce to an area, two second moments, a torsion constant and two shear factors. Shell
sections are **multi-dimensional**: they take an [nD](../materials/ND.md) material and a
thickness.

## Components in this tab

| Component | Nickname | For | Defined by |
| --- | --- | --- | --- |
| [Rectangular](rectangular.md) | `RectangleCS` | Beams | Width, Height |
| [Circular](circular.md) | `CircleCS` | Beams | Diameter, Thickness (0 = solid) |
| [Rectangular Hollow](rectangular-hollow.md) | `RectangleHollowCS` | Beams | Width, Height, Web, two flange thicknesses |
| [I Section](h-section.md) | `I Section` | Beams | Height, two flange widths and thicknesses, Web |
| [Double L-Angle](double-angle.md) | `2L` | Beams | Height, Width, Thickness, Gap |
| [Generic Section](parametric-cross-section.md) | `Generic Section` | Beams | A, Izz, Iyy, J, AlphaY, AlphaZ entered directly |
| [Steel Section Library](library.md) | `Section Library` | Beams | A catalogue name — IPE200, HEA300, and 600 more |
| [Plate Fiber Section](plate-fiber.md) | `PFS` | Shells | Thickness |

## Choosing a section

| You know | Use |
| --- | --- |
| A catalogue steel profile by name | **Steel Section Library** |
| The dimensions of a parametric profile | the matching parametric component |
| Only the stiffness properties — a homogenised deck, a section computed elsewhere | **Generic Section** |
| A shell thickness | **Plate Fiber Section** |

{% hint style="info" %}
All parametric beam sections reduce to the same OpenSees command — `section Elastic` — with
`A`, `Izz`, `Iyy`, `J`, `AlphaY` and `AlphaZ` computed from the dimensions. They differ in
how you describe the geometry and in what [Model View](../visualisation/model-view.md) draws
when extruded preview is on.

For a genuinely non-linear section, build a fibre section instead:
[Fiber Section](../moment-curvature/fiber-section.md).
{% endhint %}

## Local axes

`Izz` is bending about the local *z* axis; `Iyy` is bending about the local *y* axis. The
orientation of those axes on a beam comes from the **ZAxis** input of the
[ForceBeamColumn](../elements/force-beam-column.md) component, not from the section.
