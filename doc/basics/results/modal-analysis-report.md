# Modal Analysis Report

Reads the modal properties OpenSees writes after an eigenvalue run: masses, centre of mass,
participation factors and participation mass ratios.

## 🔧 Grasshopper component

`Modal Analysis Report (Alpaca4d)` — **Alpaca4d ▸ 08_NumericalOutput**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | A model from [Natural Vibration](../analysis/natural-vibration.md). Any other model has no report to read. |

### Outputs

Each output is the corresponding block of the report, as lines of text.

| Name | Nick | Description |
| --- | --- | --- |
| EigenValueAnalysis | `EigenValueAnalysis` | Eigenvalue, frequency, period per mode. |
| TotalMassOfStructure | `TotalMassOfStructure` | Total mass, all six directions. |
| TotalFreeMass | `TotalFreeMass` | Mass on unrestrained DOFs — the mass that can actually participate. |
| CenterOfMass | `CenterOfMass` | Coordinates of the centre of mass. |
| ModalParticipationFactors | `ModalParticipationFactors` | Participation factor per mode and direction. |
| ModalParticipationMasses | `ModalParticipationMasses` | Participating mass per mode and direction. |
| ModalParticipationMasses_Cumulative | `..._Cumulative` | Running total down the modes. |
| ModalParticipationMassesRatio(%) | `...Ratio(%)` | Participating mass as a percentage of the total. |
| ModalParticipationMassesRatio(%)_Cumulative | `...Ratio(%)_Cumulative` | Running total of the percentages. |

## 📈 When to use it

**Use it when**

- You need to show that enough modes have been included. Most codes ask for **90 %** of the
  mass in each direction — read it off
  **ModalParticipationMassesRatio(%)_Cumulative** and raise the mode count until you get
  there.
- You are checking the total mass of the model against a hand calculation. This is the
  quickest way to catch a missing density or a mis-scaled
  [Mass Point](../loads/mass-point.md).
- You need the centre of mass, for instance to place a
  [Rigid Diaphragm](../constraints/diaphragm.md) master node or to estimate torsional
  eccentricity.

**Do not use it when**

- You only want periods and frequencies → they come straight out of
  [Natural Vibration](../analysis/natural-vibration.md).

{% hint style="info" %}
The outputs are **text**, one line per row of the report — they are the report as OpenSees
wrote it, not parsed numbers. Plug them into a Panel to read, or split them yourself if you
need the values.

The report is read from `ModalReport.txt`, written next to the Grasshopper document. If the
file is missing, the model did not come from [Natural
Vibration](../analysis/natural-vibration.md), or the document was never saved.
{% endhint %}
