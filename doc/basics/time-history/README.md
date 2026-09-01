# ⌛ Time History

A **time series** is the relationship between the time in the domain, $$t$$, and the load
factor $$\lambda$$ applied to the loads of the pattern it is attached to:

$$
\lambda = F(t)
$$

Every [Load Pattern](../loads/load-pattern.md) needs one. In a static analysis the time is
a pseudo-time and the series is usually `Constant` or `Linear`; in a transient analysis it is
real time and the series carries the actual signal.

## Components in this tab

| Component | Nickname | $$\lambda(t)$$ |
| --- | --- | --- |
| [Constant](constant.md) | `Constant Time Series` | A fixed factor, independent of time. |
| [Linear](linear.md) | `Linear Time Series` | Proportional to time — a ramp. |
| [Trigonometric](trigonometric.md) | `Trigonometric Time Series` | A sine wave over a time window. |
| [Path](path.md) | `Path Time Series` | Arbitrary, from lists of times and values. |
| [Read Time Series](read-time-series.md) | `Read Time Series` | A **Path** series read from a file on disk. |

## Choosing one

| The load | Use |
| --- | --- |
| Is on for the whole analysis — dead load, permanent equipment | **Constant** |
| Should ramp up to avoid a sudden jump in a non-linear run | **Linear** |
| Is harmonic — machine vibration, an idealised base motion | **Trigonometric** |
| Follows a recorded or arbitrary signal you already have as numbers | **Path** |
| Follows a recorded signal that lives in a file | **Read Time Series** |

Every component also outputs a **Graph** — plug it into a Grasshopper *Quick Graph* or a
chart to see the signal before running anything.
