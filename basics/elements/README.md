# 🎢 Elements

The finite elements implemented are Elastic Timoshenko Beam Column Element, ShellDKGT-ASDShellQ4, SSP Brick and FourNodeTetrahedron.

**Line to Beam** component converts a line geometry to a Timoshenko Beam. Beam elements are used to model components in which one dimension (the length) is significantly greater than the other two dimensions and only the stress in the direction along the axis of the beam is significant. The cross section attached to it can be oriented using the orientSection input. beamType allows to release both ends in order to have an axial-only element (Truss).

**Mesh to Shell** component converts a mesh geometry to a Shell Element. Shell elements are used to model structures in which one dimension, the thickness, is significantly smaller than the other dimensions. Triangular faces will be converted to a ShellDKGT formulation and the Quad faces to a ShellMITC4 formulation.

**Brick Element** component converts an hexahedral element into a bbarBrick. A hexahedron is any polyhedron with six faces. It is generally a difficult task to convert a generic solid into a set of hexahedron and MeshSeriesToBrick component might help to construct some simple polyhedron.
