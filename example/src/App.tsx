import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { OrbitlyGlobe, OrbitlyGlobeRef } from 'react-native-orbitly';

export default function App() {
  const globeRef = useRef<OrbitlyGlobeRef>(null);

  return (
    <OrbitlyGlobe
      ref={globeRef}
      onCountryClick={(country) => console.log('Country clicked', country)}
      onStateClick={(state) => console.log('State clicked', state)}
      onCityClick={(city) => console.log('City clicked', city)}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  globeContainer: {
    flex: 1,
    borderRadius: 20,
    // overflow: 'hidden',
    // margin: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  }
});
