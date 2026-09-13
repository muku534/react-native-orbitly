import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { OrbitlyGlobe, type OrbitlyGlobeRef } from 'react-native-orbitly';

export default function App() {
  const globeRef = useRef<OrbitlyGlobeRef>(null);

  return (
    <View style={styles.container}>
      <OrbitlyGlobe
        ref={globeRef}
        onCountryClick={(country) => console.log('Country clicked', country)}
        onStateClick={(state) => console.log('State clicked', state)}
        onCityClick={(city) => console.log('City clicked', city)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
