TODO: add documentation

PieChart component is a wrapper over the component from Recharts library. Given some data points, it will generate and display the distribution as a pie chart (only the outer section). From a layout point of view, the chart will be centrally aligned and displayed in a SVG box with width and height set to 250.

API:

- data
  - required property, represents the array of data points used to generate the distribution
    - DataPoint { name: string, value: number } where name represents the key of each item (unique) and value will be used to calculate the percentage of each section from the total
- colorMapping
  - required property, represents the mapping between data points names and colours associated with them
- label
  - optional property, represents the text displayed in the center of the Chart
- headline
  - optional proeprty, represents the title of the Chart
- withLegend
  - optional property, controls whether or not a Legend will be displayed at the bottom of the Chart
- withTooltip
  - optional property, controls whether or not each section of the Chart will have a tooltip (with additional info)
