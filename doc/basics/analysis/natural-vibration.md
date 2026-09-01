# Natural Vibration

Solves the eigenvalue problem and returns the **modes, periods and frequencies** of the
structure. It is the first analysis worth running on any new model: the first period tells
you immediately whether the stiffness and the mass are roughly right.

## 🔧 Grasshopper component

`Natural Vibration Analysis (Alpaca4d)` — **Alpaca4d ▸ 07_Analysis**

No [Analysis Settings](analysis-settings.md) are needed — an eigenvalue problem has nothing
to converge.

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The assembled model, from [Assemble](../assemble.md). |
| Vibration Modes | `Vibration Modes` | Integer | `1` | How many modes to extract. |
| Solver | `Solver` | Text | `-genBandArpack` | Eigen solver: `-genBandArpack`, `-symmBandLapack`, `-fullGenLapack`. Attach a **Value List** for the options. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| log | `log` | Text | The OpenSees console output. |
| AlpacaModel | `AlpacaModel` | Model | The model with mode shapes attached. Feed it to [Deformed Model View](../visualisation/deformed-model-view.md) — the **Step** input then selects the mode — and to [Modal Analysis Report](../results/modal-analysis-report.md). |
| Eigenvalues | `Eigenvalues` | Number (list) | $$\lambda_n = \omega_n^2$$, one per mode. |
| Period | `Period` | Number (list) | $$T_n$$, in `s`. |
| Frequencies | `Frequencies` | Number (list) | $$f_n = \sqrt{\lambda_n}/2\pi$$, in `Hz`. |

### The solvers

| Solver | Use |
| --- | --- |
| `-genBandArpack` | The default. Iterative, and the right choice when you want a few modes out of a large model. |
| `-symmBandLapack` | Direct, for a symmetric system. |
| `-fullGenLapack` | Direct, forms the full matrices. Extracts **all** modes, but only viable on small models. |

{% hint style="warning" %}
**Save the Grasshopper file first.** This component writes `AlpacaModel.tcl`,
`recorder_eigen.mpco` and `ModalReport.txt` beside it, and throws *"Have you saved the
Grasshopper script?"* if there is nowhere to put them.
{% endhint %}

## 📈 When to use it

**Use it when**

- You have just built a model and want to sanity-check it. A first period far from
  expectation means the mass or the stiffness is wrong, and finding out now is cheap.
- You need frequencies to calibrate [Damping](damping.md).
- You need modal masses and participation factors for a response-spectrum check → read them
  from [Modal Analysis Report](../results/modal-analysis-report.md).

**Do not use it when** you want displacements or forces under load → those need
[Run Analysis](run-analysis.md).

{% hint style="info" %}
A model with no mass has no modes. Mass comes from the material density through the section,
and from [Mass Point](../loads/mass-point.md). A [Gravity Load](../loads/gravity.md) does
**not** create mass — it creates force.
{% endhint %}

## 🔗 Relation to OpenSees

```tcl
recorder mpco recorder_eigen.mpco ...
set lambdaN [eigen -genBandArpack $numModes]
puts "$lambdaN"
modalProperties -file "ModalReport.txt" -unorm
record
wipe
```

The eigenvalues are parsed back from the console output; the modal properties are read from
`ModalReport.txt` by [Modal Analysis Report](../results/modal-analysis-report.md).
