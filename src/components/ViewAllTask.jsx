import React, { useState, useEffect } from "react";
import ViewAllTaskCard from "./ViewAllTaskCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "./Loading";
import useAuth from "../hooks/useAuth";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, Clock, ListTodo } from "lucide-react";

const ViewAllTask = () => {
  const { user } = useAuth();
  const {
    data: allTask,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-task", user?.email],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/task/${user?.email}`
      );
      return data;
    },
  });

  const [tasks, setTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });

  useEffect(() => {
    if (allTask) {
      const groupedTasks = {
        "To-Do": allTask.filter((task) => task.category === "To-Do"),
        "In Progress": allTask.filter((task) => task.category === "In Progress"),
        Done: allTask.filter((task) => task.category === "Done"),
      };
      setTasks(groupedTasks);
    }
  }, [allTask]);

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    if (sourceColumn === destColumn) {
      const reorderedTasks = [...tasks[sourceColumn]];
      const [movedItem] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedItem);

      setTasks({ ...tasks, [sourceColumn]: reorderedTasks });
    } else {
      const sourceTasks = [...tasks[sourceColumn]];
      const destTasks = [...tasks[destColumn]];
      const [movedItem] = sourceTasks.splice(source.index, 1);
      const updatedTask = { ...movedItem, category: destColumn };

      destTasks.splice(destination.index, 0, updatedTask);

      setTasks({
        ...tasks,
        [sourceColumn]: sourceTasks,
        [destColumn]: destTasks,
      });

      try {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/task/${updatedTask._id}`,
          updatedTask
        );
        refetch();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const getColumnIcon = (category) => {
    switch (category) {
      case "To-Do":
        return <ListTodo className="w-5 h-5" />;
      case "In Progress":
        return <Clock className="w-5 h-5" />;
      case "Done":
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getColumnStyle = (category) => {
    switch (category) {
      case "To-Do":
        return {
          headerBg: "bg-red-50",
          headerText: "text-red-600",
          borderColor: "border-red-200",
          icon: "text-red-500",
        };
      case "In Progress":
        return {
          headerBg: "bg-yellow-50",
          headerText: "text-yellow-600",
          borderColor: "border-yellow-200",
          icon: "text-yellow-500",
        };
      case "Done":
        return {
          headerBg: "bg-green-50",
          headerText: "text-green-600",
          borderColor: "border-green-200",
          icon: "text-green-500",
        };
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-purple-50 to-indigo-50 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-12 text-center">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl"
          >
            <ClipboardList className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Task Board</h2>
          <div className="w-24 h-1 mx-auto bg-purple-600 rounded-full" />
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {Object.keys(tasks).map((category) => {
              const style = getColumnStyle(category);
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border ${style.borderColor}`}
                >
                  <div className={`p-4 ${style.headerBg} border-b ${style.borderColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={style.icon}>{getColumnIcon(category)}</span>
                        <h3 className={`font-semibold ${style.headerText}`}>
                          {category}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${style.headerBg} ${style.headerText}`}>
                        {tasks[category].length}
                      </span>
                    </div>
                  </div>

                  <Droppable droppableId={category}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-4 min-h-[calc(100vh-20rem)] transition-colors duration-200 ${
                          snapshot.isDraggingOver ? "bg-purple-50/50" : ""
                        }`}
                      >
                        <div className="space-y-3">
                          {tasks[category].map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    transform: snapshot.isDragging
                                      ? provided.draggableProps.style?.transform
                                      : "none",
                                  }}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ViewAllTaskCard task={task} refetch={refetch} />
                                  </motion.div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              );
            })}
          </div>
        </DragDropContext>
      </motion.div>
    </div>
  );
};

export default ViewAllTask;