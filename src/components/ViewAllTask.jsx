import React, { useState, useEffect } from "react";
import ViewAllTaskCard from "./ViewAllTaskCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "./Loading";
import useAuth from "../hooks/useAuth";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

  // Update tasks when data is fetched
  useEffect(() => {
    if (allTask) {
      const groupedTasks = {
        "To-Do": allTask.filter((task) => task.category === "To-Do"),
        "In Progress": allTask.filter(
          (task) => task.category === "In Progress"
        ),
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
      // Reorder within the same column
      const reorderedTasks = [...tasks[sourceColumn]];
      const [movedItem] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedItem);

      setTasks({ ...tasks, [sourceColumn]: reorderedTasks });
    } else {
      // Move between columns
      const sourceTasks = [...tasks[sourceColumn]];
      const destTasks = [...tasks[destColumn]];
      const [movedItem] = sourceTasks.splice(source.index, 1);

      // Update category
      movedItem.category = destColumn;
      destTasks.splice(destination.index, 0, movedItem);

      setTasks({
        ...tasks,
        [sourceColumn]: sourceTasks,
        [destColumn]: destTasks,
      });

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/task/${movedItem._id}`,
        {
          title: movedItem.title,
          description: movedItem.description,
          selectCategory: destColumn,
        }
      );

      refetch();
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  // ${category === "To-Do" && "bg-red-50"} ${
  //   category === "In Progress" && "bg-yellow-50"
  // } ${
  //   category === "Done" && "bg-green-50"
  // }

  return (
    <div>
      <h2 className="text-4xl  font-bold mb-4 text-center text-purple-700">
        View All Tasks
      </h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.keys(tasks).map((category) => (
            <div
              key={category}
              className={`border border-purple-400 p-4 rounded-md min-h-[300px] flex flex-col`}
            >
              <h3
                className={`text-lg font-bold mb-3 text-center ${
                  category === "To-Do" && "text-red-600"
                } ${category === "In Progress" && "text-yellow-400"} ${
                  category === "Done" && "text-green-400"
                }`}
              >
                {category}
              </h3>
              <Droppable droppableId={category}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 flex-grow"
                  >
                    {tasks[category].map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ViewAllTaskCard task={task} refetch={refetch} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ViewAllTask;
