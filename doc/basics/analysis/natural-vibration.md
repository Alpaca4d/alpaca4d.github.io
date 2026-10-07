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
| Solver | `Solver` | Text | `-genBandArpack` | Eigen solver: `-genBandArpack` or `-fullGenLapack`. Attach a **Value List** for the options. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | The model with mode shapes attached. Feed it to [View Results](../visualisation/view-results.md) — the **Step** input then selects the mode. |
| Eigenvalues | `Eigenvalues` | Number (list) | $$\lambda_n = \omega_n^2$$, one per mode. |
| Period | `Period` | Number (list) | $$T_n$$, in `s`. |
| Frequencies | `Frequencies` | Number (list) | $$f_n = \sqrt{\lambda_n}/2\pi$$, in `Hz`. |
| log | `log` | Text | The OpenSees console output. |

### Modal Report

The modal properties OpenSees writes after the eigenvalue run — masses, centre of mass,
participation factors and participation mass ratios — are outputs too, in the **Modal Report**
menu under the component. The menu starts folded; click it to show them. A wire from one of
them keeps working with the menu folded.

Each output is one section of the report, as lines of text: plug it into a Panel to read it.

| Name | Description |
| --- | --- |
| EigenValueAnalysis | Eigenvalue, frequency, period per mode. |
| TotalMassOfStructure | Total mass, all six directions. |
| TotalFreeMass | Mass on unrestrained DOFs — the mass that can actually participate. |
| CenterOfMass | Coordinates of the centre of mass. |
| ModalParticipationFactors | Participation factor per mode and direction. |
| ModalParticipationMasses | Participating mass per mode and direction. |
| ModalParticipationMasses_Cumulative | Running total down the modes. |
| ModalParticipationMassesRatio(%) | Participating mass as a percentage of the total. |
| ModalParticipationMassesRatio(%)_Cumulative | Running total of the percentages. Most codes ask for **90 %** of the mass in each direction: read it here, and raise **Vibration Modes** until you get there. |

**TotalMassOfStructure** is also the quickest check of the model's mass against a hand
calculation — it catches a missing density or a mis-scaled [Mass Point](../loads/mass-point.md).
**CenterOfMass** places a [Rigid Diaphragm](../constraints/diaphragm.md) master node, or
estimates a torsional eccentricity.

{% hint style="info" %}
**Definitions made before the Modal Report menu** open with the previous Natural Vibration
component, which still works but has no report outputs. Grasshopper's **Solution ▸ Upgrade
Components** swaps it for the current one and keeps every wire — the inputs are the same, and
each output's wires follow it by name, so the log, which used to be the first output and is now
after **Frequencies**, keeps its wires too. A Modal Analysis Report wired to it keeps working;
its outputs are the menu's, under the same names.
{% endhint %}

### The solvers

| Solver | Use |
| --- | --- |
| `-genBandArpack` | The default. Iterative, and the right choice when you want a few modes out of a large model. |
| `-fullGenLapack` | Direct, forms the full matrices. Extracts **all** modes, but only viable on small models. |

OpenSees's third, `-symmBandLapack`, solves only the standard eigenvalue problem — the stiffness
without the mass — so it cannot give natural frequencies, and the component stops with an error if
it is typed in.

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
- You need modal masses and participation factors for a response-spectrum check → open the
  [Modal Report](#modal-report) menu.

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
`ModalReport.txt` into the [Modal Report](#modal-report) outputs.
