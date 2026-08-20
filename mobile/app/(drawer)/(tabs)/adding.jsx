import { useContext } from 'react'; 
import { SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import AddPropertyScreen from '@/components/AddPropertyScreen';
import Header from '@/components/Header';
import { ThemeContext } from '@/context/ThemeContext'; 

const AddingScreen = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Screen 
        options={{
          headerShown: true,
          header: () => <Header />,
        }}
      />
      <AddPropertyScreen />
    </SafeAreaView>
  );
}

export default AddingScreen;