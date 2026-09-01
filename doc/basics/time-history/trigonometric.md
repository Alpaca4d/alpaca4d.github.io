# Trigonometric

A **trigonometric time series** is a sine wave, active over a time window:

$$
\lambda(t) = c_\text{factor} \, \sin\!\Big( \tfrac{2\pi}{T} (t - t_\text{shift}) \Big)
\qquad t_\text{start} \le t \le t_\text{end}
$$

Outside the window the load factor is zero.

## 🔧 Grasshopper component

`Trigonometric Time Series (Alpaca4d)` — **Alpaca4d ▸ 04_Time Series**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| TStart | `TStart` | Number | `0.0` | Start of the active window, in `s`. Before it the factor is zero. |
| TEnd | `TEnd` | Number | — | End of the active window, in `s`. Must be greater than `TStart`. |
| Period | `Period` | Number | — | Period $$T$$ of the sine, in `s`. Sets the frequency. |
| Shift | `Shift` | Number | `0.0` | Phase shift $$t_\text{shift}$$, in `s`. |
| LoadFactor | `LoadFactor` | Number | `1.0` | Amplitude $$c_\text{factor}$$. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| TimeSeries | `TimeSeries` | TimeSeries | Trigonometric series, for a [Load Pattern](../loads/load-pattern.md). |
| Graph | `Graph` | Number (list) | The values over the window, for plotting. |

## 📈 When to use it

**Use it when**

- The excitation is harmonic with a known frequency — a machine, a rotating unbalance, an
  idealised sinusoidal base motion.
- You want a set number of cycles: pick `Period`, then set `TEnd - TStart` to that many
  periods.
- You are sweeping frequency to find a resonance.

**Do not use it when**

- The excitation is irregular — a real earthquake record → [Path](path.md) or
  [Read Time Series](read-time-series.md).
- The loading is constant or a simple ramp → [Constant](constant.md) or [Linear](linear.md).

{% hint style="info" %}
Sample the response finely enough to see the wave. The analysis time step `Dt` on
[Analysis Step](../analysis/analysis-step.md) should be a small fraction of `Period` —
twenty points per cycle is a reasonable starting point.
{% endhint %}

## 🔗 Relation to OpenSees

```tcl
timeSeries Trig $tag $tStart $tEnd $period -shift $shift -factor $cFactor
```

Every input maps straight through.
