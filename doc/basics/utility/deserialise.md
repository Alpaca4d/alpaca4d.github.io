# Deserialise

Reads an OpenSees `.tcl` deck back into an Alpaca4d model — the reverse of
[Serialize](serialize.md). The result behaves like a model from
[Assemble](../assemble.md): preview it, analyse it, read results off it.

## 🔧 Grasshopper component

`Deserialise (Alpaca4d)` — **Alpaca4d ▸ 10_Utility**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| FilePath | `FilePath` | Text | *(empty)* | Path of the `.tcl` file to read. |
| Text | `Text` | Text (list) | *(empty)* | The contents of a `.tcl` file, as text. Used when no **FilePath** is given. |
| Tolerance | `Tolerance` | Number | `0.01` | Distance below which two node positions are treated as the same node, in `m`. Same meaning as on [Assemble](../assemble.md). |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | The assembled model. Plug it into [Model View](../visualisation/model-view.md) to see it, or into [Run Analysis](../analysis/run-analysis.md) to solve it. |

## 💡 What it understands

| Category | Commands |
| --- | --- |
| Model | `model`, `node`, `fix`, `mass` |
| Materials | `uniaxialMaterial Elastic`, `nDMaterial ElasticIsotropic`, `nDMaterial ElasticOrthotropic` |
| Sections | `section Elastic`, `section PlateFiber` |
| Elements | `element forceBeamColumn`, `ASDShellQ4`, `ASDShellT3`, `ShellDKGT`, `ShellNLDKGT`, `SSPbrick`, `FourNodeTetrahedron` |
| Transformations | `geomTransf` |
| Time series | `timeSeries Constant`, `Linear`, `Trig`, `Triangle`, `Path` |
| Constraints | `equalDOF`, `rigidDiaphragm`, `rigidLink` |
| Loads | `pattern` and its contents |

Anything else in the file is skipped. A deck using a material or element Alpaca4d does not
model will come back missing those parts, quietly — check the result in
[Model View](../visualisation/model-view.md) before trusting it.

## 📈 When to use it

**Use it when**

- Someone hands you an OpenSees model and you want to see it, or re-use its geometry.
- You have an older deck and want it back inside the parametric workflow.
- You edited a deck by hand and want to check what you actually changed.

**Do not use it when**

- The model was built in Grasshopper in the first place. A round trip through Tcl loses
  everything the deck does not carry.

{% hint style="info" %}
`equalDOF` is one of the commands read back — which is the only way an `EqualDOF` constraint
enters an Alpaca4d model, since no component produces one. See
[Rigid Link](../constraints/equal-dof.md).
{% endhint %}
