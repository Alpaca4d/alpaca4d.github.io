# 📉 Analysis

An analysis in Alpaca4d is assembled the same way OpenSees assembles one: from a handful of
objects, each answering one question. [Analysis Settings](analysis-settings.md) collects
them, and [Run Analysis](run-analysis.md) launches OpenSees.

```
Damping ─────────┐
Test ────────────┼──► Analysis Settings ──┐
Integrator ──────┤                        ├──► Run Analysis ──► AlpacaModel (with results)
Analysis Step ───┘                        │
                        AlpacaModel ──────┘
```

[Natural Vibration](natural-vibration.md) is the exception: it needs no settings at all,
because an eigenvalue problem has nothing to converge.

## Components in this tab

| Component | Nickname | Answers |
| --- | --- | --- |
| [Analysis Settings](analysis-settings.md) | `Analysis Settings` | The whole recipe — handler, numberer, system, algorithm, type. |
| [Integrator](integrator.md) | `Integrator` | How the step advances: `LoadControl`, `Newmark`, `CentralDifference`. |
| [Test](test.md) | `Test` | When an iteration has converged. |
| [Analysis Step](analysis-step.md) | `Analysis Step` | How many steps, and how long each one is. |
| [Damping](damping.md) | `Damping` | Rayleigh damping coefficients. |
| [Run Analysis](run-analysis.md) | `Run Analysis` | Runs it. |
| [Natural Vibration](natural-vibration.md) | `Natural Vibration` | Modes, periods and frequencies. |

### [Analysis Settings](analysis-settings.md)

Collects everything OpenSees needs in order to solve — constraint handler, numberer, system of
equations, convergence test, solution algorithm, integrator and stepping — into the one object
[Run Analysis](run-analysis.md) takes.

Every input has a default, so an unconnected component already describes a valid linear static
analysis. For a dynamic one set **AnalysisType** to `Transient`, and give it a `Newmark` or
`CentralDifference` [Integrator](integrator.md), an [Analysis Step](analysis-step.md) with
**Dt**, and a [Damping](damping.md).

### [Integrator](integrator.md)

How the analysis advances from one step to the next.

`LoadControl` scales the loads by a load factor and is the static integrator; `Newmark` and
`CentralDifference` step forward in time and are the transient ones.

### [Test](test.md)

When an iteration inside a step has converged, and how many iterations to allow before the step
is declared failed.

`NormDispIncr` measures how much the model still moves, `NormUnbalance` how far it is from
equilibrium, and `EnergyIncr` the product of the two. The `Relative` units compare against the
first iteration instead of an absolute tolerance, and `FixedNumIter` simply iterates a set
number of times.

### [Analysis Step](analysis-step.md)

How many increments the analysis solves, and how long each one lasts.

**NumIncr** is also how many steps the recorder writes, so it sets how many steps the
[Results](../results/README.md) components can read back. A transient analysis needs **Dt** as
well; **DtMin**, **DtMax** and **Jd** let OpenSees shrink the step when a step will not
converge.

### [Damping](damping.md)

Rayleigh damping for every element and node of the model, as a combination of the mass and
stiffness matrices:

```
D = alphaM*M + betaKcurr*Kcurrent + betaKinit*Kinit + betaKcomm*KlastCommit
```

For a damping ratio at a known circular frequency `omega`, taken from a
[Natural Vibration](natural-vibration.md) analysis, stiffness-proportional damping is
`betaKcomm = 2*ratio/omega` — so 5% at `omega` gives `0.1/omega`. Only a transient analysis
uses damping.

### [Run Analysis](run-analysis.md)

Writes the assembled model out as an OpenSees script, solves it, and returns the model with its
results attached.

Results are recorded to a `recorder.mpco` file beside the Grasshopper document and read back by
the [Results](../results/README.md) components. When a run fails the **AlpacaModel** output
comes out empty — read the **log** output to find out why.

### [Natural Vibration](natural-vibration.md)

Solves the eigenvalue problem of the model and returns its modes, eigenvalues, periods and
frequencies.

It needs no [Analysis Settings](analysis-settings.md) — an eigenvalue problem has nothing to
converge. Connect the **assembled** model rather than an analysed one, then feed the solved
model to [Nodal Displacements](../results/nodal-displacements.md) to read a mode shape, or to
[Modal Analysis Report](../results/modal-analysis-report.md) for the participating masses.

## What Alpaca4d can analyse

| Analysis | How to set it up |
| --- | --- |
| **Linear static** | Analysis Type `Static`, Integrator `LoadControl`, Algorithm `Linear`. |
| **Non-linear static / pushover** | Analysis Type `Static`, Integrator `LoadControl`, Algorithm `ModifiedNewton` or `KrylovNewton`, and a [Linear](../time-history/linear.md) time series to ramp the load. |
| **Eigenvalue / modal** | [Natural Vibration](natural-vibration.md) — no settings needed. |
| **Linear or non-linear transient** | Analysis Type `Transient`, Integrator `Newmark` or `CentralDifference`, plus [Damping](damping.md) and a [Path](../time-history/path.md) time series. |
| **Seismic time history** | As transient, with a [UniformExcitation](../loads/load-pattern.md) pattern. |

## A first static analysis

The smallest set-up that works:

1. **Integrator** → unit `LoadControl`, defaults are fine.
2. **Test** → unit `NormDispIncr`, defaults are fine.
3. **Analysis Step** → `NumIncr = 1` for a linear run.
4. **Analysis Settings** → plug in the Test, the Integrator and the Analysis Step; leave
   Analysis Type at `Static`.
5. **Run Analysis** → the model and the settings.

Then read the [Results](../results/README.md).
