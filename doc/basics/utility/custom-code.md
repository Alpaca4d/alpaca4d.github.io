# Custom Code

Appends raw OpenSees commands to the model's deck. It is the escape hatch for anything
Alpaca4d does not expose as a component.

## 🔧 Grasshopper component

`Custom code (Alpaca4d)` — **Alpaca4d ▸ 10_Utility**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | *(empty)* | The model to extend. If nothing is connected the component starts an empty deck, so it can also be used to write one from scratch. |
| CustomCode | `CustomCode` | Text (list) | — | Lines of OpenSees Tcl, appended in order. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | A copy of the model with the extra lines appended. Pass it on to [Run Analysis](../analysis/run-analysis.md). |
| Tcl | `Tcl` | Text (list) | The whole deck, so you can check where your lines landed. |

The input model is not modified — the component works on a copy.

## 📈 When to use it

**Use it when**

- You need a material, element or recorder Alpaca4d has no component for.
- You want an extra recorder writing a specific response to a file.
- You are prototyping something before it becomes a component.

**Do not use it when**

- A component already does it. Custom code is not checked, does not preview, and does not
  appear in [Model View](../visualisation/model-view.md).

{% hint style="warning" %}
**Your lines are appended, so ordering is on you.** They land after everything Alpaca4d
generated but the tags are Alpaca4d's — a material or element tag you invent may collide with
one it assigned. Read the deck with [Serialize](serialize.md) first and pick tags well above
the ones in use.

Nothing here is validated. A mistake surfaces as an OpenSees error in the
[Run Analysis](../analysis/run-analysis.md) **log**, not as a red component.
{% endhint %}
