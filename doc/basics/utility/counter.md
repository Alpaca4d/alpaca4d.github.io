# Counter

A self-advancing integer. While **Run** is true the component re-solves on a timer and
increments its output, which drives an animation without touching Rhino's own animation
tools.

## 🔧 Grasshopper component

`Counter (Alpaca4d)` — **Alpaca4d ▸ 10_Utility**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Run | `Run` | Boolean | `false` | Start or continue counting. |
| Reset | `Reset` | Boolean | `false` | Set the counter back to zero. Takes priority over **Run**. |
| Interval | `Interval` | Integer | `1` | Milliseconds between increments. Values below 1 are raised to 1. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Counter | `Counter` | Integer | The current value. |

## 📈 When to use it

**Use it when**

- You want to animate a transient result: feed **Counter** into the **Step** input of
  [Deformed Model View](../visualisation/deformed-model-view.md) or any
  [Results](../results/README.md) component and watch the response play through.
- You want to cycle through mode shapes from
  [Natural Vibration](../analysis/natural-vibration.md).

**Do not use it when**

- You want a specific step → a Number Slider is simpler and does not run away.

{% hint style="warning" %}
The counter has no upper bound and does not know how many steps your analysis produced. Past
the last step the result components will fail or return nothing. Clamp it — a *Modulus*
component against the step count keeps the animation looping.

**Interval is the timer delay, not the frame rate.** If a solve takes longer than the
interval, the definition simply runs as fast as it can. Set **Run** to `false` before editing
anything upstream, or every edit triggers a fresh solve on the timer.
{% endhint %}

{% hint style="danger" %}
Never leave **Counter** upstream of [Run Analysis](../analysis/run-analysis.md). It would
re-run OpenSees on every tick. Run the analysis once, then animate the *reading* of its
results.
{% endhint %}
