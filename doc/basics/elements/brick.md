# Brick

The **Brick** element in Alpaca4d is a **3D solid (hexahedral) element** based on the OpenSees `SSPbrick` formulation  
(*Stabilized Single-Point brick*). It is suitable for modelling **volumetric behaviour** such as foundations, cores,  
massive walls or blocks where a full three‑dimensional stress state is important.

## 🔧 Grasshopper component

The `SSP Brick (Alpaca4d)` component constructs a single brick element from a hexahedral mesh and a 3D material.

- **Inputs**
  - **Mesh**: Hexahedral mesh representing the brick geometry.  
    - Type: `Mesh` with exactly **8 vertices** (one per corner).  
    - The component internally cleans/sanitises the mesh (`CleanHexahedron`), but it is still good practice to use well‑formed bricks.
  - **Material**: 3D material assigned to the brick.  
    - Type: Alpaca4d multi‑dimensional material (e.g. concrete, soil, etc.).  
    - Controls the constitutive law in 3D (stress–strain behaviour).
  - **Colour** (optional): Display colour of the brick in Grasshopper/Rhino.

- **Outputs**
  - **Element**: Alpaca4d `SSPbrick` element that can be passed to the assemble/model component.

## 📈 When to use a brick element

- **Use it when**
  - You need **full 3D stress state** (e.g. confinement, triaxial behaviour, contact with soil or massive concrete).
  - The structure or sub‑structure cannot be represented accurately by beams or shells alone.
  - You are performing **solid mechanics** studies (e.g. stress concentrations inside a block).

- **Do not use it when**
  - The structure is **thin** compared to its in‑plane dimensions → use **Shell** elements instead.
  - Member behaviour is **beam‑like** (bending dominated) → use **Force Beam Column** or other frame elements.

## 🔗 Relation to OpenSees

Alpaca4d’s brick element writes the OpenSees `SSPbrick` command:

```tcl
element SSPbrick $eleTag $node1 $node2 $node3 $node4 $node5 $node6 $node7 $node8 $matTag $bx $by $bz
```

where:

- the 8 mesh vertices map to the node tags `$node1 ... $node8`,
- the **Material** input provides `matTag`,
- the optional body forces `$bx`, `$by`, `$bz` are set based on the **BodyForce** property inside Alpaca4d.
