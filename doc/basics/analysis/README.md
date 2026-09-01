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
