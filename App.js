import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Platform,
    FlatList,
    Pressable,
    Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

export default function App() {
    const [text, setText] = useState("");
    const [todos, setTodos] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [photo, setPhoto] = useState(null);

    const formatDate = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const addTodo = () => {
        if (!text.trim()) return;

        const newTodo = {
            id: Date.now().toString(),
            title: text.trim(),
            date: formatDate(date),
            photos: photo,
        };

        setTodos([newTodo, ...todos]);
        setText("");
        setPhoto(null);
    };

    const removeTodo = (id) => {
        setTodos(todos.filter((item) => item.id !== id));
    };

    const changeDate = (e, chdate) => {
        if (e.type === "dismissed") {
            setShowPicker(false);
            return;
        }
        setShowPicker(false);
        if (chdate) {
            setDate(chdate);
        }
    };

    const getPhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("카메라 권한이 필요합니다.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
        });

        if (result.canceled) return;

        const uri = result.assets[0].uri;
        setPhoto(uri);
    };

    const getGallery = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("갤러리 권한이 필요합니다.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.8,
        });

        if (result.canceled) return;

        const uri = result.assets[0].uri;
        setPhoto(uri);
    };

    return (
        <View style={styles.container}>
            <View style={styles.outBox}>
                <Text style={styles.title}>★ Retro Todo List ★</Text>

                <View style={styles.inputR}>
                    <TextInput
                        style={styles.in}
                        placeholder="할 일 입력"
                        placeholderTextColor="#b5aa7e"
                        value={text}
                        onChangeText={setText}
                    />

                    <Pressable
                        onPress={() => setShowPicker(true)}
                        style={styles.dateBtn}
                    >
                        <Text style={styles.dateText}>{formatDate(date)}</Text>
                    </Pressable>

                    <View style={styles.photoBox}>
                        <Pressable onPress={getPhoto} style={styles.smallBtn}>
                            <Text style={styles.smallBtnTxt}>촬영</Text>
                        </Pressable>
                        <Pressable onPress={getGallery} style={styles.smallBtn}>
                            <Text style={styles.smallBtnTxt}>갤러리</Text>
                        </Pressable>
                    </View>

                    <Pressable onPress={addTodo} style={styles.addBtn}>
                        <Text style={styles.addBtnTxt}>추가</Text>
                    </Pressable>
                </View>

                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={changeDate}
                    />
                )}

                <FlatList
                    data={todos}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        <Text style={styles.listText}>할 일이 없어요...</Text>
                    }
                    renderItem={({ item, index }) => (
                        <Pressable
                            onLongPress={() => removeTodo(item.id)}
                            style={styles.todoItem}
                        >
                            {item.photos && (
                                <Image
                                    source={{ uri: item.photos }}
                                    style={styles.photoImage}
                                />
                            )}

                            <Text style={styles.todoIndex}>{index + 1}</Text>
                            <Text style={styles.todoTitle}>{item.title}</Text>
                            <Text style={styles.todoDate}>{item.date}</Text>
                            <Text style={styles.deleteText}>
                                길게 눌러 삭제
                            </Text>
                        </Pressable>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2d2a26",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    outBox: {
        flex: 1,
        alignItems: "center",
        width: "100%",
    },
    title: {
        fontSize: 28,
        color: "#f4e9c9",
        fontWeight: "bold",
        marginBottom: 20,
        textShadowColor: "#000",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    inputR: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    in: {
        borderWidth: 2,
        borderColor: "#c5b783",
        padding: 12,
        borderRadius: 4,
        marginRight: 6,
        backgroundColor: "#f4e9c9",
        color: "#4b3f2f",
        width: 180,
        fontWeight: "bold",
    },
    dateBtn: {
        borderWidth: 2,
        borderColor: "#c5b783",
        padding: 10,
        backgroundColor: "#e2d6ab",
        marginRight: 6,
    },
    dateText: {
        fontWeight: "bold",
        color: "#4b3f2f",
    },
    photoBox: {
        marginRight: 6,
    },
    smallBtn: {
        backgroundColor: "#b89f5d",
        padding: 6,
        marginBottom: 4,
        borderWidth: 2,
        borderColor: "#5b4a2b",
    },
    smallBtnTxt: {
        color: "#fff",
        fontWeight: "bold",
    },
    addBtn: {
        backgroundColor: "#7a3d3d",
        borderWidth: 2,
        borderColor: "#4d2222",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    addBtnTxt: {
        color: "#fff",
        fontWeight: "bold",
    },
    listText: {
        marginTop: 30,
        color: "#c3b79d",
    },
    todoItem: {
        backgroundColor: "#f4e9c9",
        padding: 14,
        marginVertical: 8,
        marginHorizontal: 14,
        borderWidth: 3,
        borderColor: "#7c6a41",
    },
    photoImage: {
        width: 120,
        height: 100,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: "#7c6a41",
    },
    todoIndex: {
        fontWeight: "bold",
        color: "#3a2f1f",
    },
    todoTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#3a2f1f",
        marginVertical: 4,
    },
    todoDate: {
        color: "#6d5c43",
    },
    deleteText: {
        fontSize: 12,
        color: "#8b7b5a",
        marginTop: 6,
    },
});
