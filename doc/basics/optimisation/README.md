# 🧭 Explorer

The Explorer components run a design study: every combination of a few sliders, one
solution each, with the results, a picture and the 3D model of each design saved to a folder.
The [Alpaca4d Explorer](https://alpaca4d.github.io/explorer/) opens that folder in the browser,
to filter the designs on parallel axes, compare trade-offs and look at any of them in 2D and 3D.

They do what Colibri and Design Explorer did, shipped with Alpaca4d, so there is nothing else
to install.

## Components in this tab

| Component | Nickname | Does |
| --- | --- | --- |
| [Explorer Inputs](explorer-inputs.md) | `Explorer Inputs` | Steps through every combination of its sliders, value lists and panels. Press **Fly**. |
| [Explorer Outputs](explorer-outputs.md) | `Explorer Outputs` | Names the results a design is judged by. |
| [Explorer Record](explorer-record.md) | `Explorer Record` | Saves each design: data.csv, a picture, a 3D model. |
| [Explorer Image](explorer-image.md) | `Explorer Image` | Which views to take a picture of, and how big. |
| [Explorer Subset](explorer-subset.md) | `Explorer Subset` | Runs part of a study, to try it out or split it between machines. |

## The workflow

1. Wire the sliders, value lists and panels that make a design into
   [Explorer Inputs](explorer-inputs.md). **Name them**: each name becomes an axis.
2. Wire the results that matter - mass, maximum displacement, utilisation, first period - into
   [Explorer Outputs](explorer-outputs.md), and rename its inputs to name the columns, units
   included: `Mass [t]`.
3. Connect **Inputs** and **Outputs** to [Explorer Record](explorer-record.md), and the
   **AlpacaModel** to its **Model** input to get a 3D view. Set **Write** to `true`.
4. Press **Fly** on Explorer Inputs. Rhino stays usable while it runs; **Fly** again or *Esc*
   stops it.
5. Open the [Alpaca4d Explorer](https://alpaca4d.github.io/explorer/) and drop the study folder on
   it. Right-click Explorer Record ▸ *Open the Alpaca4d Explorer* opens both.

{% hint style="info" %}
**A stopped study picks up where it left off.** Explorer Record never saves a design twice, and
Explorer Inputs skips the designs already saved without solving them. Flying again after a
stop, a crash or an extra slider step only runs what is missing.
{% endhint %}

## What the explorer does with it

- **Filter** by dragging along any axis; combine as many as needed.
- **Goals**: click a result's name and pick *Minimise* or *Maximise*. **Pareto front** then
  keeps the designs no other design beats on every goal at once.
- **Gallery, table, scatter** of the designs that pass, sorted and coloured by any column.
- **Each design**: its picture, its 3D model, every value with where it sits in its range, and
  arrows on each input to step to the design next door, among those that pass the filters.
- **Rate** designs with stars and **export** the ones that pass as CSV.

A study folder on your computer is read by the browser and never uploaded. To share a study,
put the folder online - a GitHub repository works - and open it by its address: the address bar
then holds a link to the study, and to the design picked.
