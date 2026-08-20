// 1. تعديل الـ Imports
import { useState, useContext } from 'react'; // زدنا useContext
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, ProgressBar, Card, Title, Paragraph, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import DropdownComponent from '@/components/DropDown';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemeContext } from '@/context/ThemeContext'; // جبنا الكونتكست

const AddPropertyScreen = () => {
    const { theme } = useContext(ThemeContext);
    // State to manage the current step
    const [step, setStep] = useState(1);

    // Step 1: Basic Info State
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [purpose, setPurpose] = useState('sell'); // 'sell' or 'rent'
    const [category, setCategory] = useState('');

    // Step 2: Details State
    const [typeaddress, settypeAddress] = useState('');
    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
    const [country, setCountry] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [area, setArea] = useState('');
    const [description, setDescription] = useState('');
    const [features, setFeatures] = useState([]); // <--- HNA ZEDNA STATE Jdid ديال l'features

    // Step 3: Images State
    const [images, setImages] = useState([]);

    // Calculate progress for the ProgressBar
    const progress = step / 3;

    // --- Lista dyal l'features li momkin t-khtar ---
    const availableFeatures = [
        'Swimming Pool', 'Garden', 'Garage', 'Balcony',
        'Air Conditioning', 'Security', 'Elevator', 'Furnished'
    ];

    // --- Function bach t-toggle l'feature ---
    const toggleFeature = (feature) => {
        setFeatures(prevFeatures =>
            prevFeatures.includes(feature)
                ? prevFeatures.filter(f => f !== feature) // Ila kant, hayedha
                : [...prevFeatures, feature] // Ila makantch, zidha
        );
    };


    // --- Navigation and Validation ---
    const nextStep = () => {
        if (step === 1 && (!title || !price || !category)) {
            Alert.alert('Required Fields', 'Please fill in the title, price, and select a category before continuing.');
            return;
        }
        if (step === 2 && (!city || !region ||! country || !typeaddress || !area)) {
            Alert.alert('Required Fields', 'Please fill in the city, address,region,country and area.');
            return;
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    // --- Image Handling ---
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access the camera roll is required!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImages([...images, ...result.assets.map(asset => asset.uri)]);
        }
    };

    const removeImage = (uriToRemove) => {
        setImages(images.filter(uri => uri !== uriToRemove));
    };

    // --- Form Submission ---
    const handleSubmit = () => {
        console.log({
            title, price, purpose, category,
            city,region,country, typeaddress, bedrooms, bathrooms, area, description,
            features, // <--- HNA ZEDNAHA F SUBMIT
            images
        });
        Alert.alert('Success!', 'Your property has been added successfully.', [{ text: 'OK' }]);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            padding: 15,
        },
        card: {
            borderRadius: 12,
            elevation: 4,
            backgroundColor: theme.card,
        },
        stepTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.primary,
            marginBottom: 5,
            textAlign: 'center',
        },
        stepDescription: {
            fontSize: 14,
            color: theme.textLight,
            textAlign: 'center',
            marginBottom: 20,
        },
        input: {
            marginBottom: 12,
            backgroundColor: theme.background,
        },
        label: {
            color: theme.textLight,
            fontSize: 14,
            marginBottom: 8,
            marginLeft: 4,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        halfInput: {
            width: '48%',
        },
        chipContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: 10,
            marginBottom: 20,
        },
        chip: {
            backgroundColor: theme.card,
        },
        chipSelected: {
            backgroundColor: theme.primary,
        },
        // --- Styles jdad dyal l'features ---
        featuresContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap', // bach yhebt l ster ila 3mer
            gap: 10,
            marginTop: 10,
            marginBottom: 20,
        },
        featureChip: {
            backgroundColor: theme.background,
            borderColor: theme.border,
            borderWidth: 1,
        },
        featureChipSelected: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
        },
        // ------------------------------------
        progressBar: {
            height: 8,
            borderRadius: 4,
            marginBottom: 5,
        },
        progressText: {
            textAlign: 'center',
            marginBottom: 20,
            color: theme.textLight,
            fontSize: 12,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
        },
        navButton: {
            flex: 1,
            marginHorizontal: 5,
            paddingVertical: 5,
        },
        nextButton: {
            backgroundColor: theme.primary,
        },
        previousButton: {
            borderColor: theme.primary,
        },
        uploadButton: {
            marginBottom: 20,
            backgroundColor: theme.primary,
        },
        imagePreviewContainer: {
            flexDirection: 'row',
            marginTop: 15,
        },
        imageWrapper: {
            position: 'relative',
            marginRight: 10,
        },
        previewImage: {
            width: 100,
            height: 100,
            borderRadius: 8,
        },
        removeImageButton: {
            position: 'absolute',
            top: 5,
            right: 5,
            backgroundColor: theme.expense,
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
        },
        removeImageText: {
            color: theme.white,
        },
    });

    // --- Render Logic ---
    const renderStepContent = () => {
        const paperTheme = {
            colors: {
                primary: theme.primary,
                onSurface: theme.text,
                onSurfaceVariant: theme.textLight,
                outline: theme.border,
                background: theme.background,
            }
        };

        switch (step) {
            case 1:
                return (
                    <View>
                        <Title style={styles.stepTitle}>Step 1: Basic Information</Title>
                        <Paragraph style={styles.stepDescription}>Lets start with the propertys name, price, and category.</Paragraph>
                        <TextInput label="Ad Title (e.g., Modern Apartment in Downtown)" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} theme={paperTheme} />
                        <TextInput label="Price (MAD)" value={price} onChangeText={setPrice} keyboardType="numeric" mode="outlined" style={styles.input} theme={paperTheme} />
                        <Text style={styles.label}>Category</Text>
                        <DropdownComponent value={category} onCategoryChange={setCategory} />
                        <Text style={styles.label}>Purpose</Text>
                        <View style={styles.chipContainer}>
                            <Chip icon="cash" selected={purpose === 'sell'} onPress={() => setPurpose('sell')} style={purpose === 'sell' ? styles.chipSelected : styles.chip}>For Sale</Chip>
                            <Chip icon="key" selected={purpose === 'rent'} onPress={() => setPurpose('rent')} style={purpose === 'rent' ? styles.chipSelected : styles.chip}>For Rent</Chip>
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View>
                        <Title style={styles.stepTitle}>Step 2: Property Details</Title>
                        <Paragraph style={styles.stepDescription}>Provide more details about the location and features.</Paragraph>
                        <TextInput label="City" value={city} onChangeText={setCity} mode="outlined" style={styles.input} theme={paperTheme} />
                        <TextInput label="region" value={region} onChangeText={setRegion} mode="outlined" style={styles.input} theme={paperTheme} />
                        <TextInput label="country" value={country} onChangeText={setCountry} mode="outlined" style={styles.input} theme={paperTheme} />
                        <TextInput label="Address" value={typeaddress} onChangeText={settypeAddress} mode="outlined" style={styles.input} theme={paperTheme} />
                        <View style={styles.row}>
                            <TextInput label="Bedrooms" value={bedrooms} onChangeText={setBedrooms} keyboardType="numeric" mode="outlined" style={[styles.input, styles.halfInput]} theme={paperTheme} />
                            <TextInput label="Bathrooms" value={bathrooms} onChangeText={setBathrooms} keyboardType="numeric" mode="outlined" style={[styles.input, styles.halfInput]} theme={paperTheme} />
                        </View>
                        <TextInput label="Area (m²)" value={area} onChangeText={setArea} keyboardType="numeric" mode="outlined" style={styles.input} theme={paperTheme} />

                        {/* --- HNA FAYN ZEDNA L'FEATURES --- */}
                        <Text style={styles.label}>Features</Text>
                        <View style={styles.featuresContainer}>
                            {availableFeatures.map((feature, index) => {
                                const isSelected = features.includes(feature);
                                return (
                                    <Chip
                                        key={index}
                                        icon={isSelected ? 'check' : 'plus'}
                                        selected={isSelected}
                                        onPress={() => toggleFeature(feature)}
                                        style={isSelected ? styles.featureChipSelected : styles.featureChip}
                                        textStyle={{ color: isSelected ? theme.white : theme.text }}
                                    >
                                        {feature}
                                    </Chip>
                                );
                            })}
                        </View>
                    

                        <TextInput label="Description" value={description} onChangeText={setDescription} mode="outlined" multiline numberOfLines={4} style={styles.input} theme={paperTheme} />
                    </View>
                );
            case 3:
                return (
                    <View>
                        <Title style={styles.stepTitle}>Step 3: Photos</Title>
                        <Paragraph style={styles.stepDescription}>Add clear photos to attract more buyers.</Paragraph>
                        <Button icon="camera" mode="contained" onPress={pickImage} style={styles.uploadButton}>Pick Images from Gallery</Button>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
                            {images.map((uri, index) => (
                                <View key={index} style={styles.imageWrapper}>
                                    <Image source={{ uri }} style={styles.previewImage} />
                                    <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(uri)}>
                                        <MaterialIcons style={styles.removeImageText} name="delete-forever" size={18} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            <Card style={styles.card}>
                <Card.Content>
                    <ProgressBar progress={progress} color={theme.primary} style={styles.progressBar} />
                    <Text style={styles.progressText}>Step {step} of 3</Text>
                    {renderStepContent()}
                </Card.Content>
            </Card>

            <View style={styles.buttonContainer}>
                {step > 1 && (
                    <Button mode="outlined" onPress={prevStep} style={[styles.navButton, styles.previousButton]} theme={{ colors: { primary: theme.primary } }}>Previous</Button>
                )}
                {step < 3 && (
                    <Button mode="contained" onPress={nextStep} style={[styles.navButton, styles.nextButton]}>Next</Button>
                )}
                {step === 3 && (
                    <Button mode="contained" icon="check" onPress={handleSubmit} style={[styles.navButton, styles.nextButton]}>Add Property</Button>
                )}
            </View>
        </ScrollView>
    );
};

export default AddPropertyScreen;