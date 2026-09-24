import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

const STORAGE_KEY = "@todo_list_tasks";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setTasks(JSON.parse(data));
    } catch {
      Alert.alert("Error", "Unable to load tasks.");
    }
  };

  const saveTasks = async (updatedTasks) => {
    setTasks(updatedTasks);
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedTasks)
      );
    } catch {
      Alert.alert("Error", "Unable to save tasks.");
    }
  };

  const addTask = () => {
    const value = task.trim();

    if (!value) {
      Alert.alert("Enter Task", "Please enter a task first.");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: value,
      completed: false
    };

    saveTasks([newTask, ...tasks]);
    setTask("");
  };

  const toggleTask = (id) => {
    const updated = tasks.map((item) =>
      item.id === id
        ? { ...item, completed: !item.completed }
        : item
    );

    saveTasks(updated);
  };

  const deleteTask = (id) => {
    Alert.alert(
      "Delete Task",
      "Do you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            saveTasks(tasks.filter((item) => item.id !== id))
        }
      ]
    );
  };

  const completed = tasks.filter((item) => item.completed).length;

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <Pressable
        style={styles.taskLeft}
        onPress={() => toggleTask(item.id)}
      >
        <View
          style={[
            styles.checkbox,
            item.completed && styles.checkboxDone
          ]}
        >
          {item.completed && (
            <Text style={styles.check}>✓</Text>
          )}
        </View>

        <Text
          style={[
            styles.taskText,
            item.completed && styles.completedText
          ]}
        >
          {item.title}
        </Text>
      </Pressable>

      <Pressable onPress={() => deleteTask(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>To-Do List</Text>
          <Text style={styles.subheading}>
            {completed} of {tasks.length} tasks completed
          </Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter a task..."
            value={task}
            onChangeText={setTask}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />

          <Pressable style={styles.addButton} onPress={addTask}>
            <Text style={styles.addText}>Add</Text>
          </Pressable>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={
            tasks.length === 0
              ? styles.emptyList
              : styles.list
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>
                No tasks yet
              </Text>
              <Text style={styles.emptyText}>
                Add your first task above.
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB"
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 18
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#172033"
  },
  subheading: {
    marginTop: 5,
    fontSize: 14,
    color: "#667085"
  },
  inputRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 10
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9DEE8",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15
  },
  addButton: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center"
  },
  addText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30
  },
  emptyList: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30
  },
  emptyBox: {
    alignItems: "center"
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#344054"
  },
  emptyText: {
    marginTop: 6,
    color: "#667085"
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 1
  },
  taskLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#AAB3C2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  checkboxDone: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB"
  },
  check: {
    color: "#FFFFFF",
    fontWeight: "800"
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: "#172033"
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#98A2B3"
  },
  deleteText: {
    color: "#D92D20",
    fontWeight: "700",
    fontSize: 13
  }
});
