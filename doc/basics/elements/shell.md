# Shell

**Shell elements** in Alpaca4d are used to model **thin and moderately thick surfaces** (plates, walls, slabs, shells)  
that carry both **in‑plane (membrane)** and **out‑of‑plane (bending, shear)** actions.

In Alpaca4d these are implemented mainly via:

- `ASDShellQ4`: 4‑node quadrilateral shell element.
- `ASDShellT3`: 3‑node triangular shell element in the core).

Both are exposed through a single Grasshopper component and share the same section definition.

## 🔧 Grasshopper component

The `ASD ShellQ4 (Alpaca4d)` component creates shell elements from a mesh and a shell section.

- **Inputs**
  - **Mesh**: Surface mesh representing the shell geometry.  
    - Type: `Mesh` (quads and/or triangles).  
    - Internally, the component **explodes** the mesh into individual faces:
      - **4 vertices** → `ASDShellQ4` (quadrilateral shell).
      - **3 vertices** → `ASDShellT3` (triangular shell).
  - **Section**: Shell/plate section assigned to the element(s).  
    - Type: Alpaca4d multi‑dimensional section (thickness, material, reinforcement, etc.).
  - **Colour** (optional): Display colour for the generated shell elements.

- **Outputs**
  - **Element**: List of Alpaca4d shell elements (`ASDShellQ4` and/or `ASDShellT3`) ready to be connected to the assemble/model component.

## 📈 When to use shell elements

- **Use them when**
  - You are modelling **slabs, walls, plates, shells**, or other thin 3D structures.
  - Bending and membrane actions are both important (e.g. floor diaphragms, shear walls, tanks).
  - A full 3D solid (brick) model would be unnecessarily heavy, but a beam model is too simple.

- **Do not use them when**
  - The body is **volumetric / massive** and requires full 3D stress state → use **Brick** elements.
  - The behaviour is **1D member‑like** (beams, columns, braces) → use **Force Beam Column** or other frame elements.

## 🔗 Relation to OpenSees

Alpaca4d shells write OpenSees shell element commands, for example:

```tcl
element ASDShellQ4  $eleTag $n1 $n2 $n3 $n4 $secTag
element ASDShellT3   $eleTag $n1 $n2 $n3 $secTag
```

where:

- the mesh face vertex ordering defines `$n1 ...`,
- the **Section** input maps to `secTag`,
- the specific element type (`ASDShellQ4` vs `ASDShellT3`) is chosen internally based on face type and nonlinearity settings in Alpaca4d.
