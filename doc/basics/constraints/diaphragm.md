# 🧱 Rigid Diaphragm

A **rigid diaphragm** makes a group of nodes move as if connected by an infinitely stiff
in-plane plate. It is how you model a floor or roof slab that is far stiffer in its own plane
than the columns and walls around it.

## 🔧 Grasshopper component

`Rigid Diaphragm (Alpaca4d)` — **Alpaca4d ▸ 03_Constraint**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| SlavePoints | `SlavePoints` | Point (list) | — | The nodes tied into the diaphragm. |
| MasterPoint | `MasterPoint` | Point | centroid of the slave points | The node whose motion drives the rigid body. |
| Direction | `Direction` | Integer | `3` | Global axis **perpendicular** to the rigid plane: `1` → *yz* plane, `2` → *xz* plane, `3` → *xy* plane. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Constraint | `Constraint` | Constraint | Constraint object, to be connected to [Assemble](../assemble.md). |

## 📈 When to use it

**Use it when**

- You are modelling a reinforced-concrete slab or a composite deck as a stiff floor plate,
  one diaphragm per storey.
- You want the lateral response of a building governed by the vertical elements, without
  meshing every floor as shells.

**Do not use it when**

- The floor is genuinely flexible in plane — a timber deck, a slab with a large opening.
  Model it with [Shell](../elements/shell.md) elements instead.
- You only need two nodes tied together → use [Rigid Link](equal-dof.md).

## 💡 Notes

- The slave points must be roughly coplanar. The component warns you if they are not.
- The **Direction** must match the plane the points actually lie in — a floor slab in plan is
  `3`.
- Diaphragms dominate the global lateral behaviour. Check the direction before reading any
  storey drift.

## 🔗 Relation to OpenSees

```tcl
rigidDiaphragm $dir $masterNodeTag $slaveNodeTag1 $slaveNodeTag2 ...
```

Node tags are resolved from the point coordinates by the [Assemble](../assemble.md)
tolerance.
