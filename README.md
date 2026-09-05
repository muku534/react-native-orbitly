# react-native-orbitly 🌍

An interactive, premium 3D drill-down globe component for React Native. 

![Demo](assets/demo.gif)

## Features

- **Interactive 3D Globe**: Render a beautiful, fully interactive 3D globe.
- **Drill-Down Capability**: Handles country, state, and city click events with smooth camera zooms.
- **Zero-Config Setup**: Uses an optimized, inlined HTML engine—no manual asset linking required for iOS or Android.
- **Highly Customizable**: Inject your own styles and build your own custom UI controls over the globe.
- **Imperative API**: Programmatically control camera zoom and reset via standard React refs.

## Installation

```bash
npm install react-native-orbitly react-native-webview
# or
yarn add react-native-orbitly react-native-webview
```

*(Note: `react-native-webview` is a peer dependency and must be installed in your project).*

## Usage

```tsx
import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { OrbitlyGlobe, OrbitlyGlobeRef } from 'react-native-orbitly';

export default function App() {
  const globeRef = useRef<OrbitlyGlobeRef>(null);

  return (
    <View style={styles.container}>
      {/* 3D Globe Component */}
      <OrbitlyGlobe 
        ref={globeRef}
        style={{ flex: 1 }}
        backgroundColor="#070810"
        onCountryClick={(country) => console.log('Country clicked', country)}
        onStateClick={(state) => console.log('State clicked', state)}
        onCityClick={(city) => console.log('City clicked', city)}
      />
      
      {/* Build your own custom UI controls! */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => globeRef.current?.zoomIn()}>
          <Text style={{ color: 'white' }}>Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => globeRef.current?.reset()}>
          <Text style={{ color: 'white' }}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070810',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    gap: 10,
  }
});
```

## Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `onCountryClick` | `(countryName: string) => void` | Fired when a country is clicked. |
| `onStateClick` | `(stateName: string) => void` | Fired when a state is clicked. |
| `onCityClick` | `(cityName: string) => void` | Fired when a city is clicked. |
| `onGlobeReady` | `() => void` | Fired when the 3D engine is fully loaded. |
| `backgroundColor` | `string` | The background color behind the globe (default: `#070810`). |
| `style` | `StyleProp<ViewStyle>` | Standard React Native style prop to size the globe container. |

## Methods (via Ref)

Attach a `ref` to the component to access these methods:

- `zoomIn()`: Smoothly zooms the camera towards the surface.
- `zoomOut()`: Smoothly zooms the camera away from the surface.
- `reset()`: Resets the globe to its initial rotation and altitude.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
