# Linear

A **linear time series** makes the load factor grow in proportion to time:

$$
\lambda(t) = c_\text{factor} \, t
$$

## 🔧 Grasshopper component

`Linear Time Series (Alpaca4d)` — **Alpaca4d ▸ 04_Time Series**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| LinearFactor | `LinearFactor` | Number | `1.0` | The slope $$c_\text{factor}$$ multiplying time. Negative values ramp downwards. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| TimeSeries | `TimeSeries` | TimeSeries | Linear series, for a [Load Pattern](../loads/load-pattern.md). |
| Graph | `Graph` | Number (list) | The values, for plotting — a straight line through the origin. |

## 📈 When to use it

**Use it when**

- You want a ramp from zero to a target over a given number of steps — the normal choice for
  a **pushover** or any load-controlled non-linear static run.
- A sudden application of load would stop a non-linear analysis from converging.

**Do not use it when**

- The load is simply on → [Constant](constant.md).
- The load follows a recorded signal → [Path](path.md).

{% hint style="info" %}
In a load-controlled static analysis the pseudo-time advances by the
[Integrator](../analysis/integrator.md)'s **Lambda** at each step, so after *n* steps of
`LoadControl` with `Lambda = 1` a linear series with `LinearFactor = 1` has reached a factor
of *n*. Pair the two deliberately.
{% endhint %}

## 🔗 Relation to OpenSees

```tcl
timeSeries Linear $tag -factor $cFactor
```
