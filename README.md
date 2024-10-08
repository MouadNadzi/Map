# Interactive World Map of Submissions

## Overview

This project is a React component that displays an interactive world map showing submission data by country. It uses react-leaflet to render the map and provides features such as country highlighting, tooltips, and a sidebar with additional information.

## Features

- Interactive world map with country borders
- Color-coded countries based on number of submissions
- Hover effects to highlight countries
- Tooltips showing country name and submission count
- Sidebar with statistics, top countries list, and color legend
- Zoom and pan functionality
- Responsive design

## Installation

To use this component in your React project, follow these steps:

1. Ensure you have React and npm installed in your project.

2. Install the required dependencies:

   ```
   npm install react-leaflet leaflet
   ```

3. Copy the `WorldMap.js` file into your project's component directory.

4. Import the necessary CSS in your main `index.js` or `App.js` file:

   ```javascript
   import 'leaflet/dist/leaflet.css';
   ```

## Usage

To use the WorldMap component in your React application:

1. Import the component in your desired location:

   ```javascript
   import WorldMap from './path/to/WorldMap';
   ```

2. Use the component in your JSX:

   ```jsx
   <WorldMap />
   ```

3. Customize the `countryData` object in the WorldMap component to reflect your actual submission data.

## Customization

You can customize various aspects of the map:

- Modify the `countryData` object to update the submission counts for each country.
- Adjust the color scheme in the `getColor` function to change how countries are colored based on submission counts.
- Modify the sidebar content to display different statistics or information.
- Adjust the map's initial center point and zoom level in the `MapContainer` props.

## Dependencies

- React
- react-leaflet
- leaflet

## Contributing

Contributions to improve the component are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any problems or have any questions, please open an issue in the GitHub repository.

---

We hope you find this Interactive World Map component useful for visualizing your submission data!
