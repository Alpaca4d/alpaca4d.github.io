# Serialize

Turns the assembled model into an OpenSees `.tcl` deck, and optionally writes it to disk.

## 🔧 Grasshopper component

`Serialize (Alpaca4d)` — **Alpaca4d ▸ 10_Utility**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The model to serialise, from [Assemble](../assemble.md). |
| FilePath | `FilePath` | Text | *(empty)* | Where to write the file. |
| Save | `Save` | Boolean | `false` | Write it. Leave `false` and the deck is produced as text only. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Tcl | `Tcl` | Text (list) | The deck, one line per item. Plug it into a Panel to read it. |

## 📈 When to use it

**Use it when**

- You want to see exactly what Alpaca4d is sending to OpenSees. This is the single most
  useful thing you can do when a result looks wrong.
- You are handing the model to someone who runs OpenSees directly.
- You want to run the analysis outside Grasshopper — on a cluster, in a batch, under a
  script.
- You want to check a [Custom Code](custom-code.md) block landed where you meant.

**Do not use it when**

- You just want to run the analysis → [Run Analysis](../analysis/run-analysis.md) writes its
  own deck as `AlpacaModel.tcl` beside the Grasshopper file, which you can open afterwards.

{% hint style="info" %}
The deck Serialize produces is the **model** — nodes, elements, materials, sections, loads,
constraints. It does not include the analysis block; that comes from
[Analysis Settings](../analysis/analysis-settings.md) and is added by
[Run Analysis](../analysis/run-analysis.md). To run the file standalone, append your own
`analysis` commands, or copy them from the deck Run Analysis wrote.
{% endhint %}
