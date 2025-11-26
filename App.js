import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Platform,
    Pressable,
    Image,
    FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

export default function App() {
    const [text, setText] = useState("");
    const [todos, setTodos] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [editId, setEditId] = useState(null);

    const formatDate = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const addOrUpdateTodo = () => {
        if (!text.trim()) return;

        if (editId) {
            setTodos(
                todos.map((t) =>
                    t.id === editId
                        ? {
                              ...t,
                              title: text,
                              date: formatDate(date),
                              photos: photo,
                          }
                        : t
                )
            );
            setEditId(null);
        } else {
            const newTodo = {
                id: Date.now().toString(),
                title: text,
                date: formatDate(date),
                photos: photo,
            };
            setTodos([newTodo, ...todos]);
        }

        setText("");
        setPhoto(null);
    };

    const removeTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

    const startEdit = (item) => {
        setEditId(item.id);
        setText(item.title);
        setDate(new Date(item.date));
        setPhoto(item.photos);
    };

    const changeDate = (e, d) => {
        if (e.type === "dismissed") {
            setShowPicker(false);
            return;
        }
        setShowPicker(false);
        if (d) setDate(d);
    };

    const getPhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) setPhoto(result.assets[0].uri);
    };

    const getGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) setPhoto(result.assets[0].uri);
    };

    return (
        <View style={styles.container}>
            {/* 🔥 상단 UI 고정 높이로 지정 */}
            <View style={styles.headerBox}>
                <Text style={styles.title}>★ Retro Todo List ★</Text>

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.in}
                        placeholder="할 일 입력"
                        placeholderTextColor="#c7b5e6"
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

                    <Pressable onPress={addOrUpdateTodo} style={styles.addBtn}>
                        <Text style={styles.addBtnTxt}>
                            {editId ? "수정완료" : "추가"}
                        </Text>
                    </Pressable>
                </View>

                {photo && (
                    <Image
                        source={{ uri: photo }}
                        style={styles.previewImage}
                    />
                )}
            </View>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={changeDate}
                />
            )}

            {/* 🔥 리스트는 남은 공간 flex:1 로 */}
            <FlatList
                style={{ flex: 1 }}
                data={todos}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "center" }}
                contentContainerStyle={styles.cardWrap}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>할 일이 없어요...</Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {item.photos && (
                            <Image
                                source={{ uri: item.photos }}
                                style={styles.cardImg}
                            />
                        )}

                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardDate}>{item.date}</Text>

                        <View style={styles.cardBtns}>
                            <Pressable
                                onPress={() => startEdit(item)}
                                style={styles.editBtn}
                            >
                                <Text style={styles.editBtnTxt}>수정</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => removeTodo(item.id)}
                                style={styles.deleteBtn}
                            >
                                <Text style={styles.deleteBtnTxt}>삭제</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const BABY_PINK = "#FFC7E5";
const CLEAN_BORDER = "#EBDCF9";
const CLEAN_CARD = "#FAF7FF";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2a2141",
        alignItems: "center",
    },

    /* ⬇ 상단 UI 고정 높이 (마음에 맞게 조절 가능) */
    headerBox: {
        height: 330,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 10,
    },

    title: {
        fontSize: 28,
        color: "#f6d6ff",
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },

    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flexWrap: "wrap",
    },

    in: {
        backgroundColor: "#e9d8ff",
        borderWidth: 2,
        borderColor: CLEAN_BORDER,
        padding: 10,
        width: 150,
        borderRadius: 8,
        color: "#3e2b5c",
        fontWeight: "bold",
    },

    dateBtn: {
        borderWidth: 2,
        borderColor: CLEAN_BORDER,
        padding: 10,
        borderRadius: 8,
        backgroundColor: CLEAN_CARD,
    },

    dateText: {
        color: "#4b3870",
        fontWeight: "bold",
    },

    photoBox: {
        justifyContent: "center",
        alignItems: "center",
    },

    smallBtn: {
        backgroundColor: "#c072e8",
        width: 70,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#8d4bb8",
        marginBottom: 4,
    },

    smallBtnTxt: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },

    addBtn: {
        backgroundColor: BABY_PINK,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#f3c3da",
    },

    addBtnTxt: {
        color: "#5a3750",
        fontWeight: "bold",
    },

    previewImage: {
        width: 150,
        height: 110,
        borderRadius: 10,
        marginTop: 12,
        borderWidth: 2,
        borderColor: CLEAN_BORDER,
    },

    cardWrap: {
        paddingBottom: 80,
        alignItems: "center",
    },

    card: {
        backgroundColor: CLEAN_CARD,
        width: 150,
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: CLEAN_BORDER,
        margin: 10,
        alignItems: "center",
    },

    cardImg: {
        width: 110,
        height: 70,
        borderRadius: 8,
        marginBottom: 8,
    },

    cardTitle: {
        color: "#4c2a7b",
        fontWeight: "bold",
        textAlign: "center",
    },

    cardDate: {
        fontSize: 12,
        color: "#8b72b6",
        marginVertical: 4,
    },

    cardBtns: {
        flexDirection: "row",
        gap: 8,
        marginTop: 6,
    },

    editBtn: {
        backgroundColor: "#d9b6ff",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    editBtnTxt: { color: "#fff", fontWeight: "bold" },

    deleteBtn: {
        backgroundColor: BABY_PINK,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    deleteBtnTxt: { color: "#5a3750", fontWeight: "bold" },

    emptyText: {
        color: "#d7c5f7",
        marginTop: 30,
        textAlign: "center",
    },
});
