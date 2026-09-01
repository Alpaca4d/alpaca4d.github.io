# Shell

**Shell elements** carry both in-plane (membrane) and out-of-plane (bending, shear) actions,
and are the right choice for anything thin relative to its other two dimensions — slabs,
walls, plates, folded plates, roofs, tanks.

Alpaca4d uses the ASDShell family from ASDEA:

- `ASDShellQ4` — 4-node quadrilateral.
- `ASDShellT3` — 3-node triangle.

## 🔧 Grasshopper component

`ASD Shell (Alpaca4d)` — **Alpaca4d ▸ 02_Element**

One component covers both element types. The mesh is exploded into single faces, and each
face becomes one element: 4 vertices → `ASDShellQ4`, 3 vertices → `ASDShellT3`.

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Mesh | `Mesh` | Mesh | — | Surface mesh, in `m`. Quads and triangles may be mixed. |
| Section | `Section` | Section | — | Shell section — a [Plate Fiber Section](../sections/plate-fiber.md), which carries the thickness and an [nD material](../materials/ND.md). |
| Colour | `Colour` | Colour | Alpaca4d shell colour | Display colour in the Rhino viewport. |
| Local X Axis | `LocalX` | Vector | element default | Direction the element's local *x* axis is aligned to. Sets the axes that [Shell Forces](../results/shell-forces.md) are reported in. Leave empty to let OpenSees pick per face. |
| Is Corotational | `IsCorotational` | Boolean | `false` | Use the corotational formulation, for large displacements and rotations. |

{% hint style="info" %}
Set **Local X Axis** on any model where you intend to read `pxx`, `myy` and the rest. Without
it each face orients itself independently, and the per-face results are no longer comparable
across the mesh.
{% endhint %}

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Element | `Element` | Element | List of shell elements, one per mesh face, to be connected to [Assemble](../assemble.md). |

## 📈 When to use it

**Use it when**

- You are modelling slabs, walls, plates, shells or other thin surfaces.
- Membrane and bending actions both matter — floor diaphragms, shear walls, tanks.
- A solid model would be unnecessarily heavy but a beam model is too coarse.

**Do not use it when**

- The body is genuinely volumetric → use [Brick](brick.md) or
  [Four Node Tetrahedron](four-node-tetrahedron.md).
- The behaviour is member-like → use [ForceBeamColumn](force-beam-column.md).

## 🔗 Relation to OpenSees

```tcl
element ASDShellQ4 $eleTag $n1 $n2 $n3 $n4 $secTag <-corotational> <-local $x $y $z>
element ASDShellT3 $eleTag $n1 $n2 $n3      $secTag <-corotational> <-local $x $y $z>
```

- Node tags come from the mesh face vertices, matched to model nodes by the
  [Assemble](../assemble.md) tolerance.
- `$secTag` is the **Section** input.
- `-corotational` is emitted when **Is Corotational** is `true`.
- `-local` is emitted only when **Local X Axis** is supplied.
