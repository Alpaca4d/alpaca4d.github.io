# 🔗 Constraints

A **constraint** makes the motion of one node depend on the motion of another. Where a
[Support](../elements/support.md) holds a node still, a constraint ties nodes to each other.

Constraints remove independent degrees of freedom from the model, which is what makes them
cheap — and what makes them easy to over-use. Two constraints that close a loop, or that
both claim the same DOF, will make the system singular.

## Components in this tab

| Component | Nickname | Ties |
| --- | --- | --- |
| [Rigid Diaphragm](diaphragm.md) | `Rigid Diaphragm` | A group of nodes into a plate that is rigid in its own plane. |
| [Rigid Link](rigid-link.md) | `Rigid Link` | One node to another, as a rigid body. |
| [Equal DOF](equal-dof.md) | `Equal DOF` | Chosen degrees of freedom of one node to another, ignoring the offset between them. |

## Choosing between them

| You want | Use |
| --- | --- |
| A floor slab that is stiff in-plane | **Rigid Diaphragm**, one per storey |
| Two offset nodes to move together as a rigid body | **Rigid Link**, `beam` |
| Some degrees of freedom to read the same at two nodes — a shear key, a slider, a symmetry tie | **Equal DOF** |
| A join with real flexibility | a [Spring Link](../elements/spring-link.md) instead |
| A node held still | a [Support](../elements/support.md) instead |

{% hint style="info" %}
Constraints are solved by the **Constraint handler** set on
[Analysis Settings](../analysis/analysis-settings.md). The default, `Transformation`, handles
rigid diaphragms and rigid links correctly; `Plain` does not and will quietly give the wrong
answer. Only change it if you know why.
{% endhint %}
