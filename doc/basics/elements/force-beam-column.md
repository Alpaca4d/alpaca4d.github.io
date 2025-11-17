# Force Beam Column

A **Force Beam Column** is a frame element that uses a **force‑based (distributed plasticity)** formulation.  
Section response is integrated along the member length, which allows Alpaca4d to capture **spread of yielding** and nonlinear curvature distributions more accurately than simple hinge models.

## 🔧 Grasshopper component

The `Force Beam Column (Alpaca4d)` component creates a force‑based beam–column element from a line, section and (optionally) a geometric transformation.

- **Inputs**
  - **Line**: Centreline of the element.  
    - Type: `Curve`  
    - Units: length  
  - **Section**: Cross‑section assigned to the element.  
    - Type: Alpaca4d uniaxial section (e.g. steel, concrete, timber section components)  
    - Controls: stiffness, strength, mass density, etc.
  - **GeometricTransformation** (`GeomTransf`, optional): Local axis definition and 2D/3D beam formulation.  
    - If not provided, a **linear** transformation is automatically created from the line and a default local \( z \) axis.
  - **ZAxis** (optional): Vector controlling the local \( z \) axis orientation of the element.  
    - If omitted, Alpaca4d computes a perpendicular frame from the line.
  - **Colour** (optional): Display colour of the element in Grasshopper/Rhino.

- **Outputs**
  - **Element**: Alpaca4d `ForceBeamColumn` element ready to be connected to the assemble/model component.

## 📈 When to use a force‑based beam column

- **Use it when**
  - You want to model **nonlinear behaviour along the length** of beams/columns (distributed plasticity).
  - You need realistic curvature and rotation demands for **seismic** or **pushover** analysis.
  - You are using **advanced sections** (e.g. fibre sections) where section response is integrated along the member.

- **Do not use it when**
  - A simple **linear elastic** beam is sufficient → a simpler elastic element may be enough (depending on your Alpaca4d setup).
  - You only need very coarse global stiffness representation and want to minimise computational cost.

## 🔗 Relation to OpenSees

Alpaca4d’s `ForceBeamColumn` writes an OpenSees `forceBeamColumn` command.  
In OpenSees Tcl this has the form:

```tcl
element forceBeamColumn $eleTag $iNode $jNode $transfTag $integrationTag -mass $massDens
```

In Alpaca4d, the **GeomTransf** and **beam integration** objects (e.g. `NewtonContes`) are created and tagged automatically; the material and section data come from the **Section** input of the Grasshopper component.
