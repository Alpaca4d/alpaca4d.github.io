# 🧱 Shell (surface) load

A **shell load** is a distributed load applied over the area of 2D elements such as slabs, walls, and plates.  
In Alpaca4d this is implemented by the **`Mesh Load (Alpaca4d)`** component, which creates an `Alpaca4d.Loads.MeshLoad` object.

## Inputs

- **ShellElement** (optional): A shell element (`IShell`) to which the load is applied.  
  If left empty, the load is applied to **all shell elements** in the assembled model.
- **Force**: Rhino `Vector` with load intensity components \([px, py, pz]\) in **global coordinates**, in units of \([Force/Length²]\).  
  This represents a uniform surface pressure over the shell area.

## Output

- **Load**: A generic surface `Load` object that can be connected to a **load pattern** and then to the **Assemble** component.

## Usage notes

- Typical uses include floor live loads, roof snow loads, wind pressure on façades, and soil pressure on retaining walls.
- The sign and direction of the vector define if the pressure acts “upwards” or “downwards” with respect to the global axes.
- If several shell regions require different intensities, assign separate **Mesh Load** components and target the corresponding shell elements.