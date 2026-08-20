import { useContext } from 'react'; 
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '@/context/ThemeContext';
import { AuthContext } from '@/context/AuthContext'; // ==> 3. KANJIBO SNDO9 DYALNA (T2kked men l chemin)

export const SignOutButton = () => {
    const { theme } = useContext(ThemeContext);
    
    // ==> 4. KANJBDO LA FONCTION "signOut" MEN L CONTEXTE DYALNA
    const { signOut } = useContext(AuthContext); 
    
    // ==> 5. KANBEDDLO LA FONCTION "handleSignOut"
    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (err) {
            console.error("Sign out error:", err);
        }
    };
    
    const styles = StyleSheet.create({
        button: {
            backgroundColor: theme.expense + '20',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.expense + '50',
            alignItems: 'center',
            margin: 10,
        },
        text: {
            color: theme.expense, 
            fontSize: 16,
            fontWeight: 'bold',
        }
    });

    return (
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.text}>Sign out</Text>
        </TouchableOpacity>
    );
};