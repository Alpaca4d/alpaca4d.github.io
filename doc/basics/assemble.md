# 💾 Assemble

**Assemble** is the hinge of the whole workflow. It takes the loose pieces — elements,
supports, load patterns, constraints — works out which of them share nodes, numbers
everything, and produces the single `AlpacaModel` object that every downstream component
reads.

Nothing before Assemble knows about anything else. A beam does not know which other beam it
meets; a point load does not know which node it lands on. All of that is resolved here, and
resolved **geometrically**.

## 🔧 Grasshopper component

`AssembleModel (Alpaca4d)` — **Alpaca4d ▸ 06_Assemble**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Elements | `Elements` | Element (list) | — | Every element in the model: beams, shells, bricks, tetrahedra. |
| Supports | `Supports` | Support (list) | — | Every [Support](elements/support.md). |
| LoadPatterns | `LoadPatterns` | LoadPattern / Load (list) | *(empty)* | [Load patterns](loads/load-pattern.md) **and** [mass points](loads/mass-point.md); the two may be mixed freely on this input. Anything else is an error. |
| Constraints | `Constraints` | Constraint (list) | *(empty)* | [Rigid diaphragms](constraints/diaphragm.md) and [rigid links](constraints/equal-dof.md). |
| Recorders | `Recorders` | Recorder (list) | *(empty)* | Extra OpenSees recorders. No component currently produces one; the standard result recorders are added automatically by [Run Analysis](analysis/run-analysis.md). |
| Tolerance | `Tolerance` | Number | `0.01` | Distance below which two positions are treated as **the same node**, in `m`. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | The assembled model — feed it to [Model View](visualisation/model-view.md), [Run Analysis](analysis/run-analysis.md) or [Natural Vibration](analysis/natural-vibration.md). |
| Mass | `Mass` | Number | Total mass of the structure, in `kg`. Element mass is `area × ρ × length` and so on; a [Mass Point](loads/mass-point.md) contributes only the **Z** component of its `TransMass`. |

## 📈 When to use it

**Use it when** you have finished building elements, supports and loads. Every model passes
through Assemble exactly once; there is no other route to an `AlpacaModel`.

**Do not use it when** the model already exists as an OpenSees deck →
[Deserialise](utility/deserialise.md) assembles one directly from a `.tcl` file.

## 💡 Tolerance is the setting that matters

Every element endpoint, shell vertex and solid corner is collected, and any two within
**Tolerance** of each other become one node. Two members are connected when, and only when,
their geometry meets within that distance.

The same search attaches [point loads](loads/point-load.md),
[mass points](loads/mass-point.md), [supports](elements/support.md) and the nodes named by a
[constraint](constraints/README.md).

| Symptom | Likely cause |
| --- | --- |
| A member carries no load, or the structure is a mechanism | Tolerance too **small** — the members never met, and the model has more nodes than you think. |
| Assembly throws *"… is not part of the model"* | A load or support has no node within tolerance. |
| Distinct nodes have silently merged; a short member has vanished | Tolerance too **large**. |

Check the node count in [Model View](visualisation/model-view.md) with **Node IDs** turned on
before trusting any result.

## 💡 Degrees of freedom

A node gets **6 DOF** if any beam or shell touches it, and **3 DOF** if only solids do. This
is why:

- A brick sharing a node with a beam transfers force but no moment.
- Moments on a [point load](loads/point-load.md) and the rotational terms of a
  [mass point](loads/mass-point.md) are dropped at a 3 DOF node.

## 💡 What happens next

```
Assemble ──► Model View            (check it)
         ├──► Run Analysis          (static or transient)
         ├──► Natural Vibration     (modes and periods)
         └──► Serialize             (write the .tcl and read it yourself)
```

The model that comes back out of an analysis component is the *same* model with results
attached — which is why the [Results](results/README.md) components take an `AlpacaModel`
rather than a separate result object.
