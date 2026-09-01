# Beam Forces View

Draws internal force diagrams along the beams, in the viewport.

## 🔧 Grasshopper component

`Beam Forces View (Alpaca4d)` — **Alpaca4d ▸ 09_Visualisation**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| ForceType | `ForceType` | Integer (list) | — | Which diagrams to draw: `0` N, `1` Vy, `2` Vz, `3` Torsion, `4` My, `5` Mz. A **list**, so several can be shown at once. |
| Step | `Step` | Integer | `0` | Analysis step. |
| Scale | `Scale` | Number | `1.0` | Diagram height multiplier. |
| ShowText | `ShowText` | Boolean | `false` | Print the numeric value at each diagram point. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Info | `Info` | Text | Summary of the diagrams drawn. |

## 📈 When to use it

**Use it when**

- You want to see where the moment peaks rather than search a list for it.
- You are checking that the load path is what you intended — a diagram with the wrong shape
  is obvious at a glance.
- You are producing a figure.

**Do not use it when**

- You need the numbers → [Beam Forces](../results/beam-forces.md).

{% hint style="info" %}
The diagram is drawn through the values at the element's integration points — five per
element. On a beam modelled as one element the diagram is a five-point polyline and will
miss a peak between them. Split the beam into several elements for a diagram that looks like
the one in a textbook.
{% endhint %}

## 💡 Notes

- The diagrams are plotted in the element's local plane, so their orientation follows the
  **ZAxis** of the [ForceBeamColumn](../elements/force-beam-column.md).
- **ShowText** on a large model produces a great deal of text. Filter the model with
  **ElementIds** on [Model View](model-view.md) first, or raise **Scale** and read the shape.
