import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
}

export default function MapComponent({ latitude, longitude, title, description }: MapComponentProps) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker
        coordinate={{ latitude, longitude }}
        title={title}
        description={description}
      />
    </MapView>
  );
}