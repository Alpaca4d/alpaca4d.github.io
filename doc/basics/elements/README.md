# 🎢 Elements

Elements are the pieces the model is actually made of. Alpaca4d turns Rhino geometry —
curves, meshes — into OpenSees finite elements, and adds the boundary conditions that hold
them up.

## Components in this tab

| Component | Nickname | Builds |
| --- | --- | --- |
| [ForceBeamColumn](force-beam-column.md) | `ForceBeamColumn` | A force-based beam–column element from a curve. Switch the unit to [WithHinges](beam-with-hinges.md) for concentrated plasticity at the ends. |
| [ASD Shell](shell.md) | `ASDQ4/ASDT3` | Shell elements from the faces of a mesh — `ASDShellQ4` for quads, `ASDShellT3` for triangles. |
| [SSP Brick](brick.md) | `SSP Brick` | A stabilized single-point hexahedral solid from an 8-vertex mesh. |
| [Four Node Tetrahedron](four-node-tetrahedron.md) | `Four Node Tetrahedron` | A linear tetrahedral solid from a 4-vertex mesh. |
| [Support](support.md) | `Support` | A nodal restraint, from a point or from a plane for skewed supports. |
| [Hinge Release](hinge-release.md) | `Hinge Release` | A release condition consumed by the `WithHinges` beam unit. |

## Choosing an element

| Geometry | Use |
| --- | --- |
| One dimension much longer than the other two — frames, columns, braces, trusses | **ForceBeamColumn** |
| Yielding expected only at member ends | **ForceBeamColumn**, unit `WithHinges` |
| One dimension much smaller than the other two — slabs, walls, plates, roofs, tanks | **ASD Shell** |
| Fully volumetric, and meshable as hexahedra | **SSP Brick** |
| Fully volumetric, and only meshable as tetrahedra | **Four Node Tetrahedron** |

Most models combine several: beams for the frame, shells for slabs and walls, solids for the
local 3D regions that need them.

## Node matching

Elements are not wired to each other explicitly. [Assemble](../assemble.md) collects every
element endpoint, shell vertex and solid corner, and merges the ones that fall within its
**Tolerance** into a single node. Two members share a node when their geometry meets within
that distance — so if a connection does not transfer force, check the tolerance before
anything else.
