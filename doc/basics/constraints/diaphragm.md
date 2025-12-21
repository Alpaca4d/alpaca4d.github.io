# 🧱 Diaphragm

A **rigid diaphragm constraint** enforces that a group of nodes move together as if connected by an infinitely stiff in‑plane plate.  
This is typically used to model floors or roof slabs that are much stiffer in‑plane than the vertical elements (e.g. reinforced concrete slabs, composite decks).

In Alpaca4d this behaviour is provided by the **`Rigid Diaphragm (Alpaca4d)`** component, which creates an `Alpaca4d.Constraints.RigidDiaphragm` object.

## Inputs

- **SlavePoints**: List of points that will be tied to the diaphragm. Their in‑plane translations will be constrained to move together.  
- **MasterPoint** (optional): Reference point that controls the rigid body motion of the diaphragm (often at the centre of mass or a convenient node).  
- **Direction** (optional): Integer indicating the global axis **perpendicular** to the rigid plane:  
  - `1` → diaphragm in the **yz** plane (normal in X),  
  - `2` → diaphragm in the **xz** plane (normal in Y),  
  - `3` → diaphragm in the **xy** plane (normal in Z, typical for floor slabs).

## Output

- **Constraint**: A constraint object that can be connected to the **Assemble** component together with the rest of the model.

## Usage notes

- Make sure all **SlavePoints** lie approximately in the same plane; otherwise the component will warn you that the points are not planar.  
- In multi‑storey buildings, it is common to create one rigid diaphragm per floor to represent a stiff floor slab.  
- Diaphragms strongly influence the global lateral behaviour; always check that the assigned direction matches your intended floor plane.