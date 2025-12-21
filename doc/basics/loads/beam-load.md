# 📏 Beam (line) load

A **beam load** is a distributed load applied along the length of a 1D element (beam or frame).  
In Alpaca4d this is implemented by the **`Linear Load (Alpaca4d)`** component, which creates an `Alpaca4d.Loads.LineLoad` object.

## Inputs

- **BeamElement** (optional): A single beam element (`IBeam`) to which the load is applied.  
  If left empty, the load is applied to **all beam elements** in the assembled model.
- **Force**: Rhino `Vector` with load intensity components \([qx, qy, qz]\) in **global coordinates**, in units of \([Force/Length]\).  
  This represents a uniform line load along the full element length.

## Output

- **Load**: A generic line `Load` object that can be connected to a **load pattern** and then to the **Assemble** component.

## Usage notes

- Use beam loads for distributed actions such as self‑weight of non‑modelled finishes, façade loads, or uniform line loads (e.g. live load on a beam).
- The vector direction defines whether the load is vertical, horizontal or axial, depending on its components.
- If you need different intensities on different members, create separate **Linear Load** components and target specific `BeamElement` inputs.