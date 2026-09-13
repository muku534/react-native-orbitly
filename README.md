# react-native-orbitly 🌍

An interactive, hardware-accelerated 3D drill-down globe component for React Native (iOS & Android).

![Demo](assets/demo.gif)

## ✨ Highlights

- **3-Level Hierarchical Drill-Down**: Seamlessly navigate from **Country → State → City/District** directly on the 3D globe.
- **Official Boundaries**: Uses verified official boundaries (including full **Survey of India** topology for Jammu & Kashmir and Ladakh up to 37.07° N) with cleanly clipped international borders.
- **Ultra-Fast Performance**: Preloads all 726 Indian districts in memory for **<5ms instant rendering**, with dynamic streaming for global cities across the US, Canada, and Europe.
- **Zero-Config Setup**: Uses an optimized, self-contained engine—no manual native asset linking or Pod configuration needed.
- **Imperative Camera Controls**: Programmatically zoom in, zoom out, and reset camera view via React refs.
- **Custom UI Controls**: Overlay your own React Native components, buttons, and HUD elements cleanly over the globe.

---

## 📦 Installation

```bash
npm install react-native-orbitly react-native-webview
# or
yarn add react-native-orbitly react-native-webview
```

> **Note**: `react-native-webview` is a peer dependency and must be installed in your project.

---

## 🚀 Usage

```tsx
import React, { useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { OrbitlyGlobe, type OrbitlyGlobeRef } from "react-native-orbitly";

export default function MapScreen() {
  const globeRef = useRef<OrbitlyGlobeRef>(null);

  return (
    <View style={styles.container}>
      {/* 3D Interactive Drill-Down Globe */}
      <OrbitlyGlobe
        ref={globeRef}
        style={styles.globe}
        backgroundColor="#070810"
        onCountryClick={(country) => {
          console.log("Country tapped:", country);
        }}
        onStateClick={(state) => {
          console.log("State tapped:", state);
        }}
        onCityClick={(city) => {
          console.log("City/District tapped:", city);
        }}
      />

      {/* Custom Control Overlay */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => globeRef.current?.zoomIn()}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => globeRef.current?.zoomOut()}
        >
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={() => globeRef.current?.reset()}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070810",
  },
  globe: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    right: 20,
    gap: 12,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 212, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(0, 212, 255, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  resetButton: {
    width: 60,
    borderRadius: 16,
  },
  buttonText: {
    color: "#00d4ff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
```

---

## 🗺️ Drill-Down Levels

| Level | Interaction | Visual Behavior |
| :--- | :--- | :--- |
| **Country** | Tap any country | Smooth camera zoom to country. Renders state boundaries with yellow elevation polygons. |
| **State** | Tap any state | Auto-zooms to state centroid. Sits state underlayer flat to eliminate cliff walls, and reveals all cities/districts. |
| **City / District** | Tap any city/district | Rendered in crisp ocean-cyan (`#00b4d8`) with white borders (`#ffffff`). Actively selected cities highlight in vibrant red (`#ff1744`). |

---

## ⚙️ Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onCountryClick` | `(countryName: string) => void` | `undefined` | Callback fired when a country polygon is tapped. |
| `onStateClick` | `(stateName: string) => void` | `undefined` | Callback fired when a state polygon is tapped. |
| `onCityClick` | `(cityName: string) => void` | `undefined` | Callback fired when a city / district polygon is tapped. |
| `onGlobeReady` | `() => void` | `undefined` | Callback fired when the 3D globe engine is fully initialized. |
| `backgroundColor` | `string` | `"#070810"` | Background color behind the WebGL canvas. |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Standard React Native container style. |

---

## 🕹️ Methods (via Ref)

Attach an `OrbitlyGlobeRef` to call these imperative methods:

- `zoomIn()`: Smoothly zooms the orbital camera closer to the surface.
- `zoomOut()`: Smoothly zooms the orbital camera away from the surface.
- `reset()`: Smoothly resets the camera orientation and altitude back to initial orbital view.

---

## 📄 License

MIT © [Mukesh Prajapati](https://github.com/muku534)
