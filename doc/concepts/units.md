# 📏 Units

Alpaca4d works in one fixed set of units: metres, kilonewtons, seconds and radians, with masses
and densities given in kilograms. The inputs and the result components use them, with the few
exceptions listed below, and there is no setting to change them. Only
[Model View](../basics/visualisation/model-view.md) lets you choose the units it displays in.

## The base units

| Quantity | Unit |
| --- | --- |
| Length, coordinates, section dimensions, the Assemble **Tolerance** | `m` |
| Force | `kN` |
| Mass | `kg` |
| Time | `s` |
| Angle, rotation | `rad` |

Everything else follows from them:

| Quantity | Unit |
| --- | --- |
| Moment | `kN·m` |
| Line load, shell membrane force and transverse shear | `kN/m` |
| Pressure, stress, `E` and `G` | `kN/m²` |
| Shell bending moment | `kN·m/m` |
| Density | `kg/m³` |
| Area, second moment of area | `m²`, `m⁴` |
| Spring stiffness | `kN/m` along, `kN·m/rad` about |
| Curvature | `rad/m` |
| Velocity, acceleration | `m/s`, `m/s²` |
| Period, frequency | `s`, `Hz` |

Strains, Poisson's ratio and utilisations have no unit. The hinge lengths of
[Beam With Hinges](../basics/elements/beam-with-hinges.md) are fractions of the element length,
not lengths.

## The exceptions

- [Beam Stresses](../basics/results/beam-stresses.md) are in MPa (`N/mm²`), the unit design
  strengths are given in. Shell and brick stresses stay in `kN/m²`. One MPa is 1000 `kN/m²`.
- The [Material Database](../basics/materials/MaterialDatabase.md) stores `E` and `G` in MPa, and
  multiplies them by 1000 into `kN/m²` when it makes the material.
- Model View starts displacements in `mm` and stresses in MPa (see
  [Units in Model View](#units-in-model-view)).

## The Rhino document is read as metres

Alpaca4d never scales geometry. A coordinate goes into the OpenSees model as it stands and is read
as metres, and so is the **Tolerance**. A model drawn in millimetres would come out a thousand
times too big, so [Assemble](../basics/assemble.md) warns when the Rhino document is in any unit
other than metres. Set the document to metres before you build the model.

## What OpenSees assumes

OpenSees has no unit system. It takes every number as it is given, and the answer is right only
when all of them are in units that fit together. Alpaca4d writes the deck in `kN`, `m` and `s`,
and the mass unit that goes with them is the tonne (`kN·s²/m`), not the kilogram. So every mass
and density you give in `kg` is divided by 1000 as the deck is written: element densities and
[Mass Point](../basics/loads/mass-point.md) masses alike, so the two are on the same footing.
Self-weight is worked out by Alpaca4d with g = 9.81 `m/s²`.

{% hint style="info" %}
A ground-motion record in *g* is not converted for you. Multiply it by 9.81, in the file or on the
**Factor** of its [Load Pattern](../basics/loads/load-pattern.md), so that it is in `m/s²`.
{% endhint %}

A deck you write or edit by hand for [Custom Code](../basics/utility/custom-code.md) or
[Deserialise](../basics/utility/deserialise.md) has to keep to the same units, since OpenSees
cannot tell.

## Units in Model View

Each result in [Model View](../basics/visualisation/model-view.md) has a **Unit** menu of its own,
which starts on the unit in bold:

| Result | Units |
| --- | --- |
| Displacement | **mm**, cm, m |
| Forces, of beams and of reactions | N, **kN**, MN |
| Moments, of beams and of reactions | N·mm, N·m, kN·cm, **kN·m**, MN·m |
| Every stress | kPa (= kN/m²), **MPa** (= N/mm²), kN/cm² |
| Shell membrane forces and shears | N/m, **kN/m**, MN/m |
| Shell moments | N·m/m, **kN·m/m**, MN·m/m |

The unit picked applies to everything Model View gives out for that result: the values written on
the model, the **Info** and **Values** outputs, and the **Range**, which is typed in it. A
[Legend](../basics/visualisation/legend.md) fed from **Values** therefore reads in it too. Each
result keeps its own choice, so beam stresses can be in MPa while shell stresses are in kPa.

The menu changes only what Model View displays. The result components always give out the units
in the tables above.

## See also

- [Materials](../basics/materials/README.md) — the units of `E`, `G` and `Rho`
- [Results](../basics/results/README.md) — reading the numbers
- [Model View](../basics/visualisation/model-view.md) — the **Unit** menu
- [Axes and signs](axes-and-signs.md) — which way the numbers point
