# Equal DOF

An **Equal DOF** copies chosen degrees of freedom from one node to another. The two nodes
read the same in those and stay independent in the rest.

It copies rather than connects: the offset between the nodes plays no part, so a rotation of
the first does not move the second. That is what sets it apart from a
[Rigid Link](rigid-link.md), which carries the offset.

## 🔧 Grasshopper component

`Equal DOF (Alpaca4d)` — **Alpaca4d ▸ 03_Constraint**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| RetainedPoint | `RetainedPoint` | Point | — | The node that leads, in `m`. It keeps its own degrees of freedom. |
| ConstrainedPoint | `ConstrainedPoint` | Point | — | The node that follows, in `m`. The degrees of freedom listed in **Dof** stop being its own. |
| Dof | `Dof` | Integer (list) | *all six* | Which degrees of freedom to tie, always in global axes: `1`, `2`, `3` translation along *X*, *Y*, *Z*; `4`, `5`, `6` rotation about them. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Constraint | `Constraint` | Constraint | The tie, for the **Constraints** input of [Assemble](../assemble.md). |

## 📈 When to use it

**Use it when**

- A shear key or a slider: tie the directions that transfer force and leave the rest free.
- Two faces should be tied for symmetry.

**Do not use it when**

- The two nodes should move as one rigid body → use a [Rigid Link](rigid-link.md) with
  `beam`. Tying all six degrees of freedom reads like a rigid connection and is not one: once
  the nodes are apart, a rotation of the retained node does not move the constrained one.
- The tie runs along a skewed axis → use a [Spring Link](../elements/spring-link.md), whose
  directions are local. An Equal DOF's are always global, because a node has no axes of its
  own.
- You want to join a solid to a beam or a shell. Assemble already ties a solid's node to a
  beam or shell node in the same place, in translation, on its own.

## 💡 Notes

- **Both ends cannot be one node.** Two points closer together than the Assemble
  **Tolerance** are one node, and Assemble stops with an error saying so. OpenSees would accept
  the tie and solve it, and give a wrong answer.
- **An end that no element reaches becomes a node of its own.** [Assemble](../assemble.md)
  makes one there, and nothing holds it in the degrees of freedom left untied. Tie all six, or
  put the point on an element.

## 🔗 Relation to OpenSees

```tcl
equalDOF $retainedNodeTag $constrainedNodeTag $dof1 $dof2 ...
```

Node tags are found from the point coordinates within the [Assemble](../assemble.md)
tolerance.
