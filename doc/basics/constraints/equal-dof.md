# Rigid Link

A **rigid link** ties one node to another through an infinitely stiff connection. It is the
way to join two nodes that are offset from each other — a beam framing into the face of a
column, a member with an eccentric connection — without adding a real element.

{% hint style="warning" %}
Earlier versions of this page described an **Equal DOF** component. There is no such
component. `EqualDOF` exists inside Alpaca4d as a constraint class, used when
[Deserialise](../utility/deserialise.md) reads an `equalDOF` command back from a `.tcl`
file, but the only constraint you can build in Grasshopper node-to-node is the **Rigid
Link** described here.
{% endhint %}

## 🔧 Grasshopper component

`Rigid Link (Alpaca4d)` — **Alpaca4d ▸ 03_Constraint**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| RetainedPoint | `RetainedPoint` | Point | — | The **retained** (master) node. Its motion drives the link. |
| ConstrainedPoint | `ConstrainedPoint` | Point | — | The **constrained** (slave) node. Its motion follows. |
| Type | `Type` | Text | `beam` | `bar` or `beam`. Attach a **Value List** to the input and Alpaca4d fills it with both options. |

### The two types

| Type | Constrains | Behaves like |
| --- | --- | --- |
| `bar` | The three translational DOFs only, in the direction of the link. | A pin-ended rigid bar. Transfers force, not moment. |
| `beam` | All six DOFs. | A rigid offset. Transfers force and moment, and converts the retained node's rotation into translation at the constrained node. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Constraint | `Constraint` | Constraint | Constraint object, to be connected to [Assemble](../assemble.md). |

## 📈 When to use it

**Use it when**

- Two nodes at different locations should move as one rigid body — a beam offset from a
  column centreline, a rigid bracket, a stiff connection zone.
- You want the coupling without meshing a stiff element, which would need a stiffness chosen
  by hand and can wreck the conditioning of the system.

**Do not use it when**

- Many nodes on one floor need tying → a [Rigid Diaphragm](diaphragm.md) is one constraint
  instead of dozens.
- The connection has real flexibility — a rigid link has none.
- The link would close a loop with another constraint. Over-constraining gives a singular
  matrix, and the solver failure will not point back here.

## 🔗 Relation to OpenSees

```tcl
rigidLink $type $retainedNodeTag $constrainedNodeTag
```

`$type` is `bar` or `beam`. Node tags are resolved from the point coordinates by the
[Assemble](../assemble.md) tolerance.

For completeness, the `EqualDOF` class writes:

```tcl
equalDOF $masterNodeTag $slaveNodeTag $dof1 $dof2 ...
```

but no Grasshopper component produces one.
