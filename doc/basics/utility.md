# 🧰 Utility

The **Utility** components in Alpaca4d provide helper tools that make it easier to build, debug, exchange and customize your models.  
They are not strictly part of the structural calculation workflow, but they greatly improve productivity inside Grasshopper.

## Main utility components

- **Deconstruct (Alpaca4d)**:  
  - Introspects any Alpaca4d object and exposes its fields and properties as separate outputs.  
  - Useful for debugging, learning the internal structure of objects, or creating custom visualisations and filters.

- **Mesh Loft / Mesh Series to Brick**:  
  - `Mesh Loft` creates a mesh by lofting a series of polylines, which can then be used to generate shell or brick elements.  
  - `Mesh Series to Brick` converts a sequence of meshes into a brick‑like mesh suitable for volumetric modelling.

- **Serialize / Deserialise**:  
  - `Serialize` exports the assembled Alpaca4d model to an OpenSees **.tcl** file, optionally writing it directly to disk.  
  - `Deserialise` reads an existing OpenSees script and reconstructs points, supports, lines, shells and bricks in Rhino.

- **Custom Code**:  
  - Lets you inject raw OpenSees commands into the generated `.tcl` script, extending Alpaca4d with features not yet exposed by dedicated components.

## Usage notes

- Use **Deconstruct** whenever you are unsure what a component is outputting, or when you need to extract a specific property.  
- Use **Serialize/Deserialise** to exchange models between Grasshopper and standalone OpenSees workflows.  
- Use **Custom Code** carefully: it is powerful, but it bypasses some of Alpaca4d’s safety checks.