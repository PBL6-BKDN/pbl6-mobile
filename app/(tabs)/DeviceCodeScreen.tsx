import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function DeviceCodeScreen() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (code.trim().length > 0) {
      router.replace("/(tabs)/HomeScreen"); // chuyển sang Home
    } else {
      alert("Vui lòng nhập mã thiết bị");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-xl font-bold mb-4">Nhập mã thiết bị</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 w-64 mb-4"
        placeholder="Mã thiết bị"
        value={code}
        onChangeText={setCode}
      />
      <Button title="Kết nối" onPress={handleSubmit} />
    </View>
  );
}
