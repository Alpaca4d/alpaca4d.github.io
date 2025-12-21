# 🎢 Elements

Alpaca4d provides different finite element types to model 1D, 2D and 3D structural components.  
The main Grasshopper components are **Line to Beam**, **Mesh to Shell** and **Brick Element**.

## Beam elements – Line to Beam

The **Line to Beam** component converts Rhino curves into **Timoshenko beam elements**.

- **Usage**
  - Use beams when one dimension (length) is much larger than the cross‑section dimensions.
  - Suitable for frames, trusses, columns, beams, braces and similar members.
- **Behaviour**
  - Timoshenko formulation → includes both bending and shear deformations.
  - The cross‑section is defined separately and can be oriented using the `orientSection` input.
  - The `beamType` option allows you to release end rotations and/or forces, e.g. to create axial‑only (truss) elements.

## Shell elements – Mesh to Shell

The **Mesh to Shell** component converts mesh faces into **shell elements**.

- **Usage**
  - Use shells when one dimension (thickness) is much smaller than the in‑plane dimensions.
  - Typical applications: slabs, walls, plates, folded shells, roofs, tanks.
- **Behaviour**
  - Triangular faces are converted to **ASDShellT3** elements.
  - Quadrilateral faces are converted to **ASDShellQ4** elements.
  - The element thickness and material are defined through the assigned shell section.

## Brick elements – Brick Element

The **Brick Element** component converts hexahedral solids into **3D brick elements** (e.g. `SSPbrick` / `bbarBrick`).

- **Usage**
  - Use bricks for fully 3D stress states, such as foundations, solid walls, blocks, soil volumes, or regions with strong 3D effects.
- **Behaviour**
  - The input must be a hexahedral mesh (six‑faced solid with quadrilateral faces).
  - Creating high‑quality hex meshes can be challenging; the **MeshSeriesToBrick** utility component can help generate simple brickable volumes from a series of meshes.

In practice, you will usually **combine** these element types in the same model:  
beams for the main frame, shells for slabs and walls, and bricks for local 3D regions where needed.