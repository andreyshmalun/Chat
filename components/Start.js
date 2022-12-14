import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Start extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            color: '#090C08'
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/Background.png')} style={styles.image}>
                    <Text style={styles.title}>Chat App</Text>
                    <View style={styles.box1}>
                        <TextInput style={[styles.input, styles.smallText]}
                            placeholder='Your Name'
                            value={this.state.name}
                            onChangeText={(name) => this.setState({ name })} />
                        <View style={styles.colorWrapper}>
                            <Text style={[styles.smallText, styles.label]}>Choose Background Color:</Text>
                            <View style={styles.colors}>
                                <TouchableOpacity style={(this.state.color === '#090C08') ? [styles.color, styles.selected, styles.color1] : [styles.color, styles.color1]}
                                    onPress={() => this.setState({ color: '#090C08' })}
                                    accessible={true}
                                    accessibilityLabel="color option: black (default)"
                                    accessibilityHint="choose this to be the background color of your chat screen"
                                    accessibilityRole="button" />
                                <TouchableOpacity style={(this.state.color === '#474056') ? [styles.color, styles.selected, styles.color2] : [styles.color, styles.color2]}
                                    onPress={() => this.setState({ color: '#474056' })}
                                    accessible={true}
                                    accessibilityLabel="color option: purple"
                                    accessibilityHint="choose this to be the background color of your chat screen"
                                    accessibilityRole="button" />
                                <TouchableOpacity style={(this.state.color === '#8A95A5') ? [styles.color, styles.selected, styles.color3] : [styles.color, styles.color3]}
                                    onPress={() => this.setState({ color: '#8A95A5' })}
                                    accessible={true}
                                    accessibilityLabel="color option: blue"
                                    accessibilityHint="choose this to be the background color of your chat screen"
                                    accessibilityRole="button" />
                                <TouchableOpacity style={(this.state.color === '#B9C6AE') ? [styles.color, styles.selected, styles.color4] : [styles.color, styles.color4]}
                                    onPress={() => this.setState({ color: '#B9C6AE' })}
                                    accessible={true}
                                    accessibilityLabel="color option: green"
                                    accessibilityHint="choose this to be the background color of your chat screen"
                                    accessibilityRole="button" />
                            </View>
                        </View>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={styles.button}
                                onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
                                accessible={true}
                                accessibilityRole="button">
                                <Text style={styles.buttonText}>Start Chatting</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        padding: '20%',
        fontSize: 45,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    box1: {
        flex: 1,
        width: '88%',
        height: '44%',
        backgroundColor: '#FFFFFF',
        marginBottom: '20%',
        paddingTop: '6%',
        paddingBottom: '6%',
        alignItems: 'center',
        borderRadius: '25%'
    },
    input: {
        width: '88%',
        padding: '2%',
        height: 50,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: '25%'
    },
    colorWrapper: {
        width: '88%',
        height: '60%',
        justifyContent: 'center',
        marginLeft: '6%',
    },
    label: {
        marginBottom: '8%',
    },
    colors: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 1,
    },
    color: {
        borderRadius: '50%',
        width: 40,
        height: 40,
        marginRight: 30,
    },
    selected: {
        borderWidth: '3px',
        borderColor: 'lightgrey',
    },
    color1: {
        backgroundColor: '#090C08',
    },
    color2: {
        backgroundColor: '#474056',
    },
    color3: {
        backgroundColor: '#8A95A5',
    },
    color4: {
        backgroundColor: '#B9C6AE',
    },
    buttonWrapper: {
        width: '88%',
        flex: 1,
        justifyContent: 'end',
    },
    button: {
        height: 50,
        width: '100%',
        backgroundColor: '#757083',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '25%'
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    smallText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#757083'
    }
})