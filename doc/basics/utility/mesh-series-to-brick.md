# Mesh Series to Brick

Turns a stack of meshes into the hexahedral meshes that [SSP Brick](../elements/brick.md)
needs. Each pair of consecutive meshes in the series becomes one layer of bricks.

Hexahedral meshing is the hard part of solid modelling in Alpaca4d; this component is the
way round it when the solid can be described as a series of layers.

## 🔧 Grasshopper component

`MeshSeriesToBrick (Alpaca4d)` — **Alpaca4d ▸ 10_Utility**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Meshes | `Meshes` | Mesh (list) | — | The series, in order. Every mesh must have the **same topology** — same vertex count, same face layout. |
| Closed | `Closed` | Boolean | `false` | `true` also joins the last mesh back to the first, closing the series into a ring or a torus. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Mesh | `Mesh` | Mesh (list) | One 8-vertex hexahedral mesh per brick. Graft it into [SSP Brick](../elements/brick.md), which makes one element per mesh. |

## 📈 When to use it

**Use it when**

- The solid is a layered form: a wall built in courses, an extrusion, a 3D-printed shape, a
  swept or lofted volume.
- You need a hexahedral mesh and would rather not build one by hand.

**Do not use it when**

- The geometry is irregular and cannot be described as layers → use
  [Four Node Tetrahedron](../elements/four-node-tetrahedron.md) with a tetrahedral mesh
  instead.

## 💡 Typical chain

```
Sections ──► Mesh Loft ──► [list of meshes] ──► Mesh Series to Brick ──► SSP Brick ──► Assemble
```

{% hint style="info" %}
Every mesh in the series must share topology, so build them from the same base mesh —
transform or morph one mesh repeatedly rather than meshing each layer separately.

The number of bricks is `(layers − 1) × faces`, and closed series give one more layer. It
grows fast; check the count before assembling.
{% endhint %}
