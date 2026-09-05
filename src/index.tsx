import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { GLOBE_HTML } from './globeHtml';

export interface OrbitlyGlobeProps {
  onCountryClick?: (countryName: string) => void;
  onStateClick?: (stateName: string) => void;
  onCityClick?: (cityName: string) => void;
  onGlobeReady?: () => void;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

export interface OrbitlyGlobeRef {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}

export const OrbitlyGlobe = forwardRef<OrbitlyGlobeRef, OrbitlyGlobeProps>(({
  onCountryClick,
  onStateClick,
  onCityClick,
  onGlobeReady,
  backgroundColor = '#070810',
  style,
}, ref) => {
  const webviewRef = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      webviewRef.current?.injectJavaScript(`if(window.globe) window.globe.pointOfView({ altitude: Math.max(0.1, window.globe.pointOfView().altitude - 0.2) }, 500); true;`);
    },
    zoomOut: () => {
      webviewRef.current?.injectJavaScript(`if(window.globe) window.globe.pointOfView({ altitude: Math.min(4, window.globe.pointOfView().altitude + 0.2) }, 500); true;`);
    },
    reset: () => {
      webviewRef.current?.injectJavaScript(`if(window.resetGlobeToInitialState) window.resetGlobeToInitialState(); true;`);
    }
  }));

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'country-clicked' && onCountryClick) {
        onCountryClick(data.country);
      } else if (data.type === 'state-clicked' && onStateClick) {
        onStateClick(data.state);
      } else if (data.type === 'district-clicked' && onCityClick) {
        onCityClick(data.district);
      }
    } catch (e) {
      if (event.nativeEvent.data === 'globe-ready' && onGlobeReady) {
        onGlobeReady();
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: GLOBE_HTML }}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback={true}
        allowsBackForwardNavigationGestures={false}
        onMessage={handleWebViewMessage}
        onError={(e) => console.log('OrbitlyGlobe WebView error:', e.nativeEvent)}
        style={styles.webview}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
