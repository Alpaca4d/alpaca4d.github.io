# 📄 Report

The report component writes a PDF of your model and what the analyses found: tables, text and
pictures of the model and its results, one after the other, as a template lists them. The same
template writes the same report for another model, or for this one after a change.

## Components in this tab

The tab holds three groups, left to right: the report and its page, the content you write, and the
content Alpaca4d makes of the models.

| Group | Component | Nickname | Gives the report |
| --- | --- | --- | --- |
| The report | [Report](report.md) | `Report` | Writes the PDF: the page, then the content in order, the pictures drawn by Model View without a Model View on the canvas. It also takes a template written in JSON. |
| | [Report Page](report-page.md) | `ReportPage` | The paper — A4 to A0, Letter, Legal or your own — which way round, the margins and the title block. |
| | [Report Title Block](report-title-block.md) | `TitleBlock` | Your title block, drawn on every page: lines, filled areas, texts with the page number, a logo. |
| Your content | [Report Text](report-text.md) | `ReportText` | The title, a heading, a paragraph or a note, with numbers of the models filled in. |
| | [Report Table](report-table.md) | `ReportTable` | A table of your own: a caption, a header and a unit per column, and the values, a column per input. |
| | [Report Page Break](report-page-break.md) | `PageBreak` | A new page. |
| From the models | [Report Result Table](report-result-table.md) | `ResultTable` | A table Alpaca4d makes of a model: its sections and supports, the displacements, the reactions, the frequencies, the buckling factors, the footfall response. |
| | [Report View](report-view.md) | `ReportView` | A picture, by topic — the model, a static analysis, natural vibration, stability, a pushover, footfall — each with what it needs: how many modes, which result, the colours, the view — and the tables of what it draws, after it or before it. |

## A report in Grasshopper

Wire the models — from Assemble and from the analyses — into the **AlpacaModel** of
[Report](report.md); the parts, in the order they go in the report, into a **Merge**, and the Merge
into its **Content**; [Report Page](report-page.md) into its **Page**; a **Button** into its **Run**.
The parts hold no model: each says what it needs, and the Report finds it among its models, so the
same parts write the report again after any change to the model.
