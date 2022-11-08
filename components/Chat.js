import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import 'react-native-gesture-handler';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import { getBottomSpace } from 'react-native-iphone-x-helper';
// Import functions from SDKs
const firebase = require('firebase');
require('firebase/firestore')


export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: '',
                name: '',
                avatar: '',
            },
            isConnected: false,
            image: null,
            location: null
        };

        //Set up Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyCQmXlWZkeOBU6Ocyqnggzvmle9AOh-Q3M",
            authDomain: "chatapp-6126b.firebaseapp.com",
            projectId: "chatapp-6126b",
            storageBucket: "chatapp-6126b.appspot.com",
            messagingSenderId: "1011586801561",
            appId: "1:1011586801561:web:e3014b438dd9059313fd08",
            measurementId: "G-KS7PF13VBD"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.referenceChatMessages = firebase.firestore().collection('messages');
    }

    //Retrieve collection data & store in messages
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // Go through each document
        querySnapshot.forEach((doc) => {
            // Get QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text || '',
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                },
                image: data.image || null,
                location: data.location || null,
            });
        });
        this.setState({
            messages,
        });
    };

    //Read & update messages in storage
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
        } catch (error) {
            console.log(error.message);
        }
    }


    componentDidMount() {

        //Display username in navigation
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });

        //If user is online --> authenticate & load messages via Firebase 

        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.setState({
                    isConnected: true,
                });
                console.log('online');


                //Anonymous user authentication 
                this.referenceChatMessages = firebase.firestore().collection('messages');


                this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    if (!user) {
                        firebase.auth().signInAnonymously();
                    }
                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: 'https://placeimg.com/140/140/any',
                        },
                    });
                    this.unsubscribe = this.referenceChatMessages
                        .orderBy('createdAt', 'desc')
                        .onSnapshot(this.onCollectionUpdate);
                    this.saveMessages();
                });
            }
            // If user is offline --> load & display messages from asyncStorage
            else {
                this.setState({
                    isConnected: false,
                });
                console.log('offline');
                this.getMessages();
            }
        })
    }

    componentWillUnmount() {
        if (this.isConnected) {
            this.unsubscribe();
            this.authUnsubscribe();
        }
    }


    //Save messages to database
    addMessages = () => {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: message.user,
            image: message.image || null,
            location: message.location || null,
        });
    }

    //Appends new message to previous  
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.saveMessages();
            this.addMessages(this.state.messages[0]);
            this.deleteMessages();
        });
    }

    //Allows bubble customization   
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={styles.bubble}
            />
        )
    }

    //Hides input when offline
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };


    //Returns MapView if message contains location data
    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }


    render() {
        const { color, name } = this.props.route.params;

        return (
            <View style={[{ backgroundColor: color }, styles.container]}>
                <GiftedChat
                    bottomOffset={getBottomSpace()}
                    renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    messages={this.state.messages}
                    isConnected={this.state.isConnected}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.user._id,
                        name: name,
                        avatar: this.state.user.avatar,
                    }}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}

                />
                {/*Prevent hidden input field on Android*/}
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chatTitle: {
        color: '#FFFFFF'
    },
    bubble: {
        left: {
            backgroundColor: 'white',
        },
        right: {
            backgroundColor: 'dodgerblue'
        }
    }
})