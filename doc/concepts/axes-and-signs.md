# 📐 Axes and signs

Alpaca4d uses two kinds of axes. The **global** axes are Rhino's world X, Y and Z, with Z up:
loads, nodal displacements and gravity are in them. Each element also has **local** axes of its
own, and beam and shell forces are reported in those, so the sign of a result depends on which
way the element's axes run.

## What is in which axes

| Quantity | Axes |
| --- | --- |
| [Point](../basics/loads/point-load.md), [beam](../basics/loads/beam-load.md) and [shell](../basics/loads/shell-load.md) loads | Global. A beam load is resolved onto the beam's local axes before it is written. |
| [Gravity](../basics/loads/gravity.md) | Global −Z |
| [Nodal Displacements](../basics/results/nodal-displacements.md) | Global |
| [Beam Forces](../basics/results/beam-forces.md), [Beam Stresses](../basics/results/beam-stresses.md) | The beam's local *x*, *y*, *z* |
| [Shell Forces](../basics/results/shell-forces.md) | The shell's local axes 1, 2, 3 |
| [Brick Stresses](../basics/results/brick-stresses.md) | Global, or each element's own axes from its node order |
| [Reaction Forces](../basics/results/reaction-forces.md) | The support's own plane |

**Local Axes** in [Model View](../basics/visualisation/model-view.md) draws every element's local
axes as red, green and blue arrows: *x*, *y*, *z* on beams, 1, 2, 3 on shells and solids. When a
result looks as if it is about the wrong axis, turn it on first.

## Local axes of a beam

Local *x* runs along the beam from its I end, the start of the line, to its J end. The
**ZAxis** input sets local *z*, and *y* completes the frame.

Left empty, **ZAxis** is horizontal, so local *y* points as near straight up as the beam allows.
A section's depth (the height of a rectangle, an I or a hollow section) is laid along local *y*,
so `Izz` is the strong axis, the section stands the right way up, and gravity on a floor beam
shows up as `Vy` and `Mz`. A vertical member, which has no "up" across it, gets local *y* along
global X.

The section itself has no orientation: turning a beam is always done with **ZAxis**. On a
[Truss](../basics/elements/force-beam-column.md), **ZAxis** only turns the section, for drawing and
for the steel check, since a bar carries axial force alone.

## Beam force signs

The forces are signed as OpenSees reports them, in the beam's local axes:

| Force | Positive when |
| --- | --- |
| N | the member is in tension |
| Mz | the +*y* side is in compression: sagging, on a beam with *y* up |
| My | the +*z* side is in tension |
| Vy | Vy = dMz/dx: a cantilever fixed at I and loaded at J towards −*y* |
| Vz | Vz = dMy/dx: a cantilever fixed at I and loaded at J towards +*z* |
| Mx | a torque about +*x* is applied at the J end (right-hand rule) |

The two shears do not follow the same rule. OpenSees defines each shear as the slope of the
moment it goes with, and Mz and My take opposite signs for the same curvature. The stresses
follow from the same signs:

$$\sigma = \frac{N}{A} - \frac{M_z\,y}{I_z} + \frac{M_y\,z}{I_y}$$

[Beam Stresses](../basics/results/beam-stresses.md) and [Utilisation](../basics/results/utilisation.md)
use these signs as they are. The fibre sections of [Moment Curvature](../basics/moment-curvature/README.md)
are signed the same way: positive My stretches the +*z* side, positive Mz the −*y* side. Their
fibres are drawn in the world XY plane, world X being local *y* and world Y local *z*.

## Local axes of a shell

A shell face's local *z* (axis 3) is its normal, and which side it points to follows the order of
the mesh's vertices, not the world. A mesh whose faces point down has its +*z* side underneath.

Local *x* (axis 1) is set by the **Local X Axis** input of [ASD Shell](../basics/elements/shell.md).
It is flattened onto each face, so it only has to point roughly the right way. Left empty, each
face orients itself independently, and two neighbouring faces of one slab can report `mxx` about
different directions: the numbers can no longer be compared or contoured. So set it on any model
whose shell results you will read. It cannot stand square to the shell: within 1° of the normal of
any face is an error, so a horizontal slab takes a horizontal vector, not Z.

## Shell force signs

All shell forces are per unit width. Positive membrane force (`pxx`, `pyy`) is tension. `mxx` is
the moment whose stresses run along local *x*, bending the shell about local *y*; `myy` the one
whose stresses run along *y*. A positive `mxx` or `myy` puts the face on the **+*z*** side, the
side the blue arrow points to, in tension. On a cantilever slab whose mesh faces up, `mxx` is
positive over the support.

## Support planes

A [Support](../basics/elements/support.md) acts along the axes of a plane. Given a **Point**, the
plane is world-aligned, and **Tx** to **Rz** are the global directions. Given a **Plane**, they
are that plane's own axes: that is how an inclined roller or a bearing on a sloping face is made.
Elastic springs act along and about the same axes. A Compression Only support holds along the
plane's *Z* only while the node moves against *Z*, which is down for a Point; turning the plane
over makes it hold in tension instead.

[Reaction Forces](../basics/results/reaction-forces.md) reports each reaction in its support's
plane, as the force the support applies to the structure, signed along the plane's axes. A
released direction of a skewed support then reads as the zero it is, rather than being spread
over the three global components.

A [Spring Link](../basics/elements/spring-link.md) counts its directions in a plane too: left
empty, *x* runs along the link and *y* and *z* across it.

## See also

- [Force Beam Column](../basics/elements/force-beam-column.md) — the **ZAxis** input
- [Shell](../basics/elements/shell.md) — the **Local X Axis** input
- [Beam Forces](../basics/results/beam-forces.md) — the beam sign convention in full
- [Shell Forces](../basics/results/shell-forces.md) — the shell sign convention in full
- [Support](../basics/elements/support.md) — supports on a plane
- [Units](units.md) — the units the forces are in
