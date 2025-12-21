# 🎯 Point load

A **point load** is a concentrated force (and optionally a moment) applied at a single point of the structure.  
In Alpaca4d this is typically used to represent loads from columns, machines, connections, or other localized actions.

The Grasshopper component is **`Point Load (Alpaca4d)`** and creates an `Alpaca4d.Loads.PointLoad` object.

## Inputs

- **Point**: Rhino `Point` where the load acts in space.  
  This point will be associated with the nearest structural node during assembly.
- **Force**: Rhino `Vector` with the load components \([Fx, Fy, Fz]\) in **global coordinates**, in units of \([Force]\).
- **Moment** (optional): Rhino `Vector` with the moment components \([Mx, My, Mz]\) in **global coordinates**, in units of \([Force·Length]\).  
  If omitted, only the force is applied.

## Output

- **Load**: A generic `Load` object that can be connected to a **load pattern** component and then to the **Assemble** component.

## Usage notes

- Use point loads when the area of application is small compared to the structural dimensions (e.g. a column reaction on a beam).
- The force and moment direction are always defined in the **global** axes, regardless of member orientation.
- Multiple point loads can be combined in the same **load pattern** to form a load case.