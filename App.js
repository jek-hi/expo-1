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
            photos: photo || null,
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

        setPhoto(result.assets[0].uri);
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

        setPhoto(result.assets[0].uri);
    };

    return (
        <View style={styles.container}>
            <View style={styles.outBox}>
                <Text style={styles.title}>★ Retro Todo List ★</Text>

                <View style={styles.inputR}>
                    <TextInput
                        style={styles.in}
                        placeholder="할 일 입력"
                        placeholderTextColor="#d5c6f7"
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

                {photo && (
                    <Image
                        source={{ uri: photo }}
                        style={styles.previewImage}
                    />
                )}

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
                        <View style={styles.todoItem}>
                            {item.photos && (
                                <Image
                                    source={{ uri: item.photos }}
                                    style={styles.photoImage}
                                />
                            )}

                            <Text style={styles.todoIndex}>{index + 1}</Text>
                            <Text style={styles.todoTitle}>{item.title}</Text>
                            <Text style={styles.todoDate}>{item.date}</Text>

                            <Pressable
                                onPress={() => removeTodo(item.id)}
                                style={styles.deleteBtn}
                            >
                                <Text style={styles.deleteBtnTxt}>삭제</Text>
                            </Pressable>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const BABY_PINK = "#FFC7E5"; // 포근한 베이비핑크
const BABY_PINK_BORDER = "#E8A8CB";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2a2141",
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
        color: "#f6d6ff",
        fontWeight: "bold",
        marginBottom: 20,
        textShadowColor: "#000",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    inputR: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    in: {
        borderWidth: 2,
        borderColor: "#b191f3",
        padding: 12,
        borderRadius: 4,
        marginRight: 6,
        backgroundColor: "#e9d8ff",
        color: "#3e2b5c",
        width: 180,
        fontWeight: "bold",
    },
    dateBtn: {
        borderWidth: 2,
        borderColor: "#b191f3",
        padding: 10,
        backgroundColor: "#d9c4ff",
        marginRight: 6,
    },
    dateText: {
        fontWeight: "bold",
        color: "#3f295c",
    },
    photoBox: {
        marginRight: 6,
    },
    smallBtn: {
        backgroundColor: "#c072e8",
        padding: 6,
        marginBottom: 4,
        borderWidth: 2,
        borderColor: "#6a2d91",
        alignItems: "center",
    },
    smallBtnTxt: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },

    /* ★★★ 여기부터 베이비핑크 버튼 ★★★ */

    addBtn: {
        backgroundColor: BABY_PINK, // 베이비핑크
        borderWidth: 2,
        borderColor: BABY_PINK_BORDER,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    addBtnTxt: {
        color: "#5a3750",
        fontWeight: "bold",
        textAlign: "center",
    },
    deleteBtn: {
        marginTop: 8,
        backgroundColor: BABY_PINK, // 베이비핑크
        padding: 10,
        borderWidth: 2,
        borderColor: BABY_PINK_BORDER,
        width: 120,
        alignSelf: "center",
        alignItems: "center",
    },
    deleteBtnTxt: {
        color: "#5a3750",
        fontWeight: "bold",
        fontSize: 12,
        textAlign: "center",
    },

    /* 나머지 동일 */

    previewImage: {
        width: 150,
        height: 120,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: "#b191f3",
    },
    listText: {
        marginTop: 30,
        color: "#d7c5f7",
    },
    todoItem: {
        backgroundColor: "#f3daff",
        padding: 14,
        marginVertical: 8,
        marginHorizontal: 14,
        borderWidth: 3,
        borderColor: "#b191f3",
        alignItems: "center",
    },
    photoImage: {
        width: 120,
        height: 100,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: "#9b72d9",
    },
    todoIndex: {
        fontWeight: "bold",
        color: "#4c2a7b",
    },
    todoTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4c2a7b",
        marginVertical: 4,
        textAlign: "center",
    },
    todoDate: {
        color: "#7a62a8",
    },
});
