# 💣 Loads

A **load** is an action on the structure. Loads are not applied directly: they are grouped
into a [Load Pattern](load-pattern.md), which attaches a
[time series](../time-history/README.md) saying how the group varies with time. The pattern
is what goes into [Assemble](../assemble.md).

```
Load ──┐
Load ──┼──► Load Pattern ──► Assemble ──► Run Analysis
Load ──┘        ▲
                └── Time Series
```

## Components in this tab

| Component | Nickname | Applies |
| --- | --- | --- |
| [Gravity](gravity.md) | `Gravity Load` | Self-weight of every element in the model. |
| [Point](point-load.md) | `Point Load` | A concentrated force and moment at a point. |
| [Beam](beam-load.md) | `LinearLoad` | A uniform line load along beam elements. |
| [Shell](shell-load.md) | `MeshLoad` | A uniform surface pressure on shell elements. |
| [Mass Point](mass-point.md) | `Mass Point` | Added nodal mass, for dynamic analysis. |
| [Load Pattern](load-pattern.md) | `Load Pattern` | Groups loads and gives them a time series. |

## Notes that apply to all of them

- **Directions are global.** Force and moment vectors are in world coordinates, whatever the
  member orientation.
- **Loads find their target by position.** A point load is attached to the nearest node
  within the [Assemble](../assemble.md) **Tolerance**. If a load appears to do nothing, check
  that a node actually exists where you put it.
- **[Mass Point](mass-point.md) is not really a load.** It contributes mass, not force, and
  goes straight into Assemble's `LoadPatterns` input alongside the patterns — it does not
  need one of its own.
