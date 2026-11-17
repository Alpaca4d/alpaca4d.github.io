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
| [Mass from Loads](mass-from-loads.md) | `Mass from Loads` | The weight of loads as mass, with a factor: finishes, and part of the imposed load. |
| [Load Pattern](load-pattern.md) | `Load Pattern` | Groups loads and gives them a time series. |
| [Load Combination](load-combination.md) | `Combination` | Adds load combinations to the model: patterns acting together, each times a factor, 1.35 G + 1.5 Q. Run Analysis solves each, and hands on one model that holds them all. |

## Notes that apply to all of them

- **Directions are global.** Force and moment vectors are in world coordinates, whatever the
  member orientation.
- **Loads find their target by position.** A point load is attached to the nearest node
  within the [Assemble](../assemble.md) **Tolerance**. If a load appears to do nothing, check
  that a node actually exists where you put it.
- **[Mass Point](mass-point.md) and [Mass from Loads](mass-from-loads.md) are not really
  loads.** They contribute mass, not force, and go straight into Assemble's `LoadPatterns` input
  alongside the patterns — they do not need one of their own.
