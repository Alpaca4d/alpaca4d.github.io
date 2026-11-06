# 🧱 Which element

The element follows the shape of the part and what it has to carry. A part with one dimension much
longer than the other two is a beam, one with a dimension much smaller than the other two is a
shell, and a part with neither is a solid. A connection with a stiffness of its own, between two
parts, is a spring link. Most models mix several kinds.

## At a glance

| Element | Made from | Takes | Carries | Read with |
| --- | --- | --- | --- | --- |
| [ForceBeamColumn](../basics/elements/force-beam-column.md) | a curve | a beam section | axial force, two shears, torsion, two moments | [Beam Forces](../basics/results/beam-forces.md), [Beam Stresses](../basics/results/beam-stresses.md), [Utilisation](../basics/results/utilisation.md), [Node Forces](../basics/results/node-forces.md) |
| [Beam With Hinges](../basics/elements/beam-with-hinges.md) | a curve | a beam section, a [Hinge Release](../basics/elements/hinge-release.md) per end | the same, with released ends | the same |
| [Truss](../basics/elements/force-beam-column.md) | a straight line | a beam section, for its area and material | axial force only | [Beam Forces](../basics/results/beam-forces.md) (N), [Node Forces](../basics/results/node-forces.md) |
| [ASD Shell](../basics/elements/shell.md) | quad and triangle mesh faces | a [Plate Fiber Section](../basics/sections/plate-fiber.md) | membrane forces, bending, transverse shear | [Shell Forces](../basics/results/shell-forces.md), [Shell Section](../basics/visualisation/shell-section.md) |
| [SSP Brick](../basics/elements/brick.md) | an 8-vertex mesh | an [nD material](../basics/materials/ND.md) | the full 3D stress state | [Brick Stresses](../basics/results/brick-stresses.md) |
| [Ten Node Tetrahedron](../basics/elements/ten-node-tetrahedron.md) | a 4-vertex mesh | an [nD material](../basics/materials/ND.md) | the full 3D stress state | [Brick Stresses](../basics/results/brick-stresses.md) |
| [Spring Link](../basics/elements/spring-link.md) | a line between two existing nodes | a [uniaxial material](../basics/materials/Uniaxial.md) per direction, read as a stiffness | what each direction is given | no result component yet |

## Beams: ForceBeamColumn, Beam With Hinges, Truss

The three are types of one switcher, `ForceBeamColumn (Alpaca4d)`, picked in its **Element Type**
menu.

**ForceBeamColumn** is the element for any line-like member: beams, columns, braces. It is
force-based: the section response is integrated along the member, at five Newton–Cotes points,
rather than a shape being assumed for the curvature. The sections Alpaca4d gives a beam are
elastic, `section Elastic`: a fibre section cannot yet be assigned to one.

**Beam With Hinges** is the same element with a hinge zone at each end. A released degree of
freedom becomes a hinge section with that stiffness scaled by 10⁻⁶. It is how a member end is
pinned, or released about one axis. Because the release is a very soft section rather than a
true free end, it is approximate, and its accuracy depends on the hinge length, which is why that
length is clamped.

**Truss** is a bar that carries axial force only, in tension and compression, or in one of the
two: a cable or a bracing rod that goes slack when pushed, a strut that lets go when pulled. It
is always corotational, so it holds for large displacements too. A line load on it goes to its
two end nodes, half each, as it has no bending to carry the load with. A cable needs a
**Prestress**: straight and slack, it has no stiffness across its length. A tension-only or
compression-only bar needs a non-linear analysis to let go: Newton, in several steps.

Beam forces are read at the integration points of each element, and
[Gravity Load](../basics/loads/gravity.md) puts a beam's weight on its end nodes. Both are reasons
to split a beam into five or more elements per span. A member that can buckle on its own needs
splitting too, which [Linear Buckling](../basics/analysis/linear-buckling.md) does with
**Divisions**.

## Shells: ASD Shell

For slabs, walls, plates, roofs and tanks: anything thin compared with its other two dimensions,
where membrane action and bending both matter. Each mesh face becomes one element: `ASDShellQ4`
for a quad, `ASDShellT3` for a triangle, and the two may be mixed in one mesh. **Is Corotational**
turns on the corotational formulation, for large displacements and rotations. Set **Local X Axis**
whenever you will read the forces: see [Axes and signs](axes-and-signs.md#local-axes-of-a-shell).

## Solids: SSP Brick and Ten Node Tetrahedron

For bodies that are truly volumetric, where a full 3D stress state matters: foundations, massive
walls, blocks, regions of stress concentration.

- **SSP Brick** is a hexahedron with one integration point and a stabilisation term, which keeps
  it free of the shear locking a fully integrated 8-node brick suffers in bending, and cheap. Use
  it when the volume meshes into hexahedra.
- **Ten Node Tetrahedron** is the quadratic tetrahedron: its strain varies linearly through it,
  so it can bend. Use it for volumes that only mesh into tetrahedra, which is most geometry not
  drawn for bricks. A cantilever 10 × 1 × 1 cut into 60 tetrahedra deflects 0.4018 with it,
  against beam theory's 0.4024, and 0.098 with four node tetrahedra. It needs an OpenSees newer
  than 3.8.0, and its supports have to hold the edge nodes as well as the corners.

## Connections: Spring Link

A spring link joins two nodes that are apart, with one uniaxial spring per local direction and
nothing in the directions left out: a bearing, a bolt group, the interlayer of laminated glass.
It has no mass and makes no nodes, so both ends have to land on nodes the model already has. When
the join has no give at all, a [Rigid Link](../basics/constraints/rigid-link.md) is exact; when a
node is held against the ground, that is a [Support](../basics/elements/support.md).

## Mixing elements

[Assemble](../basics/assemble.md) joins elements wherever their geometry meets within its
**Tolerance**. A node gets 6 degrees of freedom when a beam or a shell touches it, and 3 when only
solids do. So a brick or a tetrahedron sharing a node with a beam passes force to it but no
moment, and a spring link on a solid's node has only its three translations.

How closely each element reproduces the textbook answers is shown in the
[benchmarks](../benchmark/intro.md): [beams](../benchmark/simple-beam.md),
[shells](../benchmark/simple-shell.md) and [bricks](../benchmark/simple-brick.md).

## See also

- [Elements](../basics/elements/README.md) — every element component
- [Sections](../basics/sections/README.md) — what a beam or a shell is made of
- [Materials](../basics/materials/README.md) — uniaxial or nD
- [How a model is built](how-a-model-is-built.md) — where the elements go
- [Axes and signs](axes-and-signs.md) — the local axes of beams and shells
