export default function TodoSection({
  filteredTasks,
  editingTaskId,
  setEditingTaskId,
  toggleTask,
  updateTask,
  removeTask,
  newTask,
  setNewTask,
  addTask,
}) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5">
      <h2 className="text-2xl font-semibold">To Do lijst</h2>
      <p className="text-stone-500 text-sm mt-1">
        Alles wat je nog moet doen voor je dinner.
      </p>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-stone-200 px-3 py-2"
          placeholder="Nieuwe taak..."
          value={newTask.title}
          onChange={(e) => setNewTask({ title: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />

        <button
          onClick={addTask}
          className="rounded-xl bg-red-500 px-4 py-2 text-white"
        >
          Toevoegen
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {filteredTasks.map((task) => {
          const isEditing = editingTaskId === task.id;

          return (
            <div
              key={task.id}
              className="flex items-start gap-3 rounded-2xl border border-stone-200 p-3"
            >
              <input
                type="checkbox"
                checked={task.completed === true}
                onChange={() => toggleTask(task.id)}
                className="mt-1 h-4 w-4"
              />

              <div className="flex-1">
                {!isEditing ? (
                  <div
                    className={`font-medium ${
                      task.completed === true ? "line-through text-stone-400" : ""
                    }`}
                  >
                    {task.title}
                  </div>
                ) : (
                  <input
                    className="w-full rounded-xl border border-stone-200 px-3 py-2"
                    value={task.title}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingTaskId(null);
                    }}
                    autoFocus
                  />
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingTaskId(isEditing ? null : task.id)}
                  className="text-xs text-stone-500 hover:text-stone-900"
                >
                  {isEditing ? "Klaar" : "Bewerk"}
                </button>

                <button
                  onClick={() => removeTask(task.id)}
                  className="text-xs text-stone-400 hover:text-red-500"
                >
                  Verwijder
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}