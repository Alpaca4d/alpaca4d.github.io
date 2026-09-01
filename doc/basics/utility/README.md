# 🧰 Utility

The utility components are not part of the structural calculation. They help you build,
debug, exchange and extend a model.

## Components in this tab

| Component | Nickname | Does |
| --- | --- | --- |
| [Deconstruct](deconstruct.md) | `Deconstruct` | Explodes any Alpaca4d object into its fields. |
| [Serialize](serialize.md) | `Serialize` | Writes the model out as an OpenSees `.tcl` deck. |
| [Deserialise](deserialise.md) | `Deserialise` | Reads a `.tcl` deck back into an Alpaca4d model. |
| [Custom Code](custom-code.md) | `Custom Code` | Appends raw OpenSees commands to the deck. |
| [Mesh Loft](mesh-loft.md) | `Mesh Loft` | Lofts a series of polylines into a mesh. |
| [Mesh Series to Brick](mesh-series-to-brick.md) | `Mesh Series to Brick` | Turns a stack of meshes into hexahedra for brick elements. |
| [Counter](counter.md) | `Counter` | A self-advancing integer, for animations. |

## What they are for

**Understanding the model.** [Deconstruct](deconstruct.md) is the fastest way to find out
what a component actually produced, and what properties an object carries.

**Getting geometry in.** [Mesh Loft](mesh-loft.md) and
[Mesh Series to Brick](mesh-series-to-brick.md) exist because hexahedral meshing is the hard
part of using [SSP Brick](../elements/brick.md).

**Getting the model in and out.** [Serialize](serialize.md) and
[Deserialise](deserialise.md) are a round trip between Grasshopper and plain OpenSees — hand
a deck to a collaborator who does not use Rhino, or bring an existing model in.

**Going past what the components cover.** [Custom Code](custom-code.md) appends anything
OpenSees understands. It bypasses Alpaca4d's checks, so it is powerful in both directions.
