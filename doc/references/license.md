---
description: Alpaca4d - License
---

# 📕 License

Alpaca4d is a commercial Grasshopper plug-in. This page explains what you are paying for — and, just as importantly, what is not part of the purchase.

## What you are buying

Alpaca4d builds your structural model inside Grasshopper, writes it out as an OpenSees input file (`AlpacaModel`), hands that file to the solver installed on your computer, and brings the results back into Grasshopper for inspection and visualisation.

Your license covers that plug-in in full — every component in the toolbar: materials, sections, elements, loads, the model assembler, the `.tcl` writer, the analysis components, the result readers and the viewers.

## What you are not buying: OpenSees

OpenSees is the analysis engine — the program that actually solves your model. It is open-source software developed at UC Berkeley, subject to its own license, and **it is not part of your purchase**. Alpaca4d does not include, bundle, or resell it.

You download OpenSees yourself, from the official UC Berkeley page, and point Alpaca4d at it once — [Setup](../setup.md) walks you through it. From then on, Alpaca4d simply writes a file that OpenSees understands and launches the program you installed.

So your use of OpenSees runs under UC Berkeley's own terms, which you accept directly with them when you download it. Paying for Alpaca4d changes nothing in either direction: it buys you no rights in OpenSees, and it takes none away. Those terms are short — read them on the [OpenSees](opensees.md) page, where they are reproduced in full.

|                                                                              | Where it comes from                             | Terms that apply                                          |
| ---------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| **Alpaca4d** — Grasshopper components, `.tcl` writer, result readers, views   | Purchased from us                               | This page                                                 |
| **OpenSees** — the analysis engine                                            | Downloaded by you, from UC Berkeley             | [The Regents' license](opensees.md#copyright-and-license) |

## Your models stay yours

The `.tcl` file Alpaca4d writes is plain text in the public, documented OpenSees input format. It is your file: keep it, edit it by hand, archive it alongside the project, send it to a reviewer, or run it with any OpenSees build you like. A colleague who does not own Alpaca4d can still re-run your analysis from that file alone.

## How the license works

After payment you receive a product key by email, which activates Alpaca4d on the computer you install it on. To activate it, open **Alpaca4d ▸ License ▸ Activate License** in Grasshopper and add it there. Get in touch if you change machine.

There are two licenses, and they unlock the same components:

* **Student**, for study and research only, not for commercial work. It needs a valid student ID.
* **Professional**, for any work, commercial work included.

A license runs for **one year**, with email support. When it ends, Alpaca4d goes back to the limits below until you renew; your files and models are not affected.

Prices, the full terms and a table of what each license can do are on the [buy page](https://alpaca4d.github.io/buy.html); email [alpaca4d@gmail.com](mailto:alpaca4d@gmail.com) first if you need a quotation, a proforma invoice, or your company details on the invoice.

## Without a license

You can try Alpaca4d without a license, within these limits:

|  | Without a license | With a license |
| --- | --- | --- |
| [Run Analysis](../basics/analysis/run-analysis.md), [Natural Vibration](../basics/analysis/natural-vibration.md) and [Linear Buckling](../basics/analysis/linear-buckling.md) | Models of up to 50 elements | Any size |
| [Topology Optimisation](../basics/optimisation/topology-optimisation.md) | Models of up to 500 elements | Any size |
| [View Results](../basics/visualisation/view-results.md) and [Model View](../basics/visualisation/model-view.md) | Not available | Available |
| [Moment Curvature](../basics/moment-curvature/moment-curvature.md), [Moment Curvature Diagram](../basics/moment-curvature/moment-curvature-diagram.md), [Interaction Domain](../basics/moment-curvature/interaction-domain.md), its [views](../basics/moment-curvature/domain-views.md) and [Domain Check](../basics/moment-curvature/domain-check.md) | Not available | Available |
| [Explorer Inputs](../basics/optimisation/explorer-inputs.md), saving a study with [Explorer Record](../basics/optimisation/explorer-record.md), [Non-Linear Optimisation](../basics/optimisation/non-linear-optimisation.md) and Section Optimiser | Not available | Available |
| Every other component | Available | Available |

A model over the limit, or one of those components, stops with an error that says why, and the License window opens so you can add a license. It opens no more than once every five minutes. Everything else works as normal: you can build a model, run an analysis of up to 50 elements or a topology optimisation of up to 500, and read its results with the [Results](../basics/results/README.md) components.

## Independence and warranty

Alpaca4d is an independent project. It is not affiliated with, endorsed by, or sponsored by the University of California, Berkeley, the OpenSees developers, or the Pacific Earthquake Engineering Research Center. "OpenSees" is named here descriptively, to identify the software Alpaca4d writes input for.

Alpaca4d is provided "as is", without warranty of any kind. As noted on the [Welcome](../README.md) page, results should always be validated against another finite element package.

If anything here is unclear for your situation, please get in touch before purchasing.
