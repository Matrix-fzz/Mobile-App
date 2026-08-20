import AllCategoriesList from '@/components/AllCategoriesList';
import CityButtons from '@/components/CityButtons';
import { ThemeContext } from '@/context/ThemeContext';
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput,  View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation } from "@react-navigation/native";

const SearchScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    // ما بقيناش محتاجين headerContainer لأننا غادي نستعملو ListHeaderComponent
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.background,
      paddingBottom: 10,
      paddingTop: 22,
      paddingHorizontal: 15,
      gap: 15,
      borderBottomWidth: 1, // زدت بوردر خفيف لتحت
      borderBottomColor: theme.border,
    },
    logoimg: {
      contentFit: 'cover',
      width: 50,
      height: 40,
    },
    barse: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    iconbtnone: {
      fontSize: 26,
      color: theme.primary,
      marginRight: 10,
    },
    searchbar: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
      paddingLeft: 18,
       // زدت padding
    },
    iconbtntwo: {
      fontSize: 26,
      color: theme.primary,
    },
    input: {
      flex: 1,
      color: theme.text, // استعملت theme.text
      fontSize: 16,
      paddingVertical: 10, // زدت padding
    },
    // ما بقيناش محتاجين scrollContainer
  });


  const ListHeader = () => (
    <>
      <AllCategoriesList searchQuery={searchQuery} />
      
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
  
      <View style={styles.headerContent}>
        <Image source={require('@/assets/images/logonestify.png')} style={styles.logoimg} />
        <View style={styles.barse}>
          <View style={styles.searchbar}>
            <TextInput
              placeholderTextColor={theme.textLight}
              placeholder="Search..."
              keyboardType='text'
              value={searchQuery}
              style={styles.input}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search-outline" style={styles.iconbtnone} />
          </View>
           <Pressable
                    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                    style={{ marginLeft: 8 }} // بدلتها لـ marginLeft باش تعطي مسافة
                >
                    <MaterialCommunityIcons
                        name="dots-vertical"
                        size={28} // كبرت الأيقونة شوية
                        color={theme.text} // <--- تبدل اللون
                    />
                </Pressable>
        </View>
      </View>

    
      <CityButtons 
        searchQuery={searchQuery}
        ListHeaderComponent={ListHeader}
      />
    </SafeAreaView>
  );
}

export default SearchScreen;