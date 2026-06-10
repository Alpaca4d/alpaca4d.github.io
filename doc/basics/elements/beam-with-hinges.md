# Beam With Hinges

A **Beam With Hinges** is a frame element that concentrates inelastic behaviour in **discrete plastic hinge zones** at the element ends.  
The interior of the element remains **linear elastic**, while the I and J ends use a `HingeRadau` integration scheme to capture localised plasticity over a specified hinge length.

## 🔧 Grasshopper component

The `Beam With Hinges (Alpaca4d)` component is a switcher component. Switch to the **WithHinges** mode to construct a beam with plastic hinge zones.

- **Inputs**
  - **Line**: Centreline of the element.  
    - Type: `Curve`  
    - Units: length
  - **Section**: Interior (elastic) cross-section assigned to the element.  
    - Type: Alpaca4d uniaxial section (e.g. steel, concrete, timber section components)
  - **GeometricTransformation** (`GeomTransf`, optional): Local axis definition and corotational/linear formulation.  
    - If not provided, a **Linear** transformation is automatically created from the line and a default local \( z \) axis.
  - **ZAxis** (optional): Vector controlling the local \( z \) axis orientation of the element.  
    - If omitted, Alpaca4d computes a perpendicular frame from the line.
  - **ReleaseI** (optional): Release condition at the **I end** of the element.  
    - Type: Alpaca4d `Release` object (from the `Hinge Release (Alpaca4d)` component).  
    - Set a DOF to `False` to release it — Tx, Ty, Tz, Rx, My, Mz.  
    - If omitted, a **fully fixed** end condition is used.
  - **LpI** (optional): Plastic hinge length at the **I end**.  
    - Units: length  
    - Default: `0.01`
  - **ReleaseJ** (optional): Release condition at the **J end** of the element.  
    - Type: Alpaca4d `Release` object.  
    - If omitted, a **fully fixed** end condition is used.
  - **LpJ** (optional): Plastic hinge length at the **J end**.  
    - Units: length  
    - Default: `0.01`
  - **Colour** (optional): Display colour of the element in Grasshopper/Rhino.

- **Outputs**
  - **Element**: Alpaca4d `BeamWithHinges` element ready to be connected to the assemble/model component.

## 📈 When to use beam with hinges

- **Use it when**
  - You want to model **concentrated plasticity** at the ends of beams or columns (e.g. moment frames undergoing seismic or pushover loading).
  - Your structural model assumes that inelastic deformation is confined to **known hinge locations**, with an elastic interior span.
  - You need to **release specific DOFs** at element ends (e.g. pinned connections, moment releases) while keeping the rest of the member elastic.
  - Computational cost is a concern — this approach is lighter than a fully distributed-plasticity fibre model along the whole member.

- **Do not use it when**
  - Yielding may develop **anywhere along the member length** → use a `Force Beam Column` with a fibre section instead.
  - You need to resolve moment or curvature distributions within the elastic interior span.
  - The plastic hinge length \( l_p \) is uncertain or highly variable — results can be sensitive to this parameter.

## 🔗 Relation to OpenSees

Alpaca4d's `BeamWithHinges` writes an OpenSees `forceBeamColumn` command with an inline `HingeRadau` integration specification:

```tcl
element forceBeamColumn $eleTag $iNode $jNode $transfTag {HingeRadau $secTagI $lpI $secTagJ $lpJ $secTagC} -mass $massDens
```

- `$secTagI` / `$secTagJ` — auto-generated elastic sections at the hinge zones. Released DOFs have their stiffness scaled by \( 10^{-6} \), effectively decoupling that force/moment component.
- `$lpI` / `$lpJ` — plastic hinge lengths at the I and J ends.
- `$secTagC` — interior elastic section (the **Section** input of the Grasshopper component).
- `$massDens` — mass per unit length, derived from the section area and material density.

In Alpaca4d, all section tags and the geometric transformation are created and numbered automatically.
