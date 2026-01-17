import { useState } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { InputForm, type TaskInput } from './components/InputForm';
import { TaskList } from './components/TaskList';
import { ReportView } from './components/ReportView';
import { MemoArea } from './components/MemoArea';
import { useAppState } from './hooks/useAppState';
import { findOverlappingTask } from './utils/aggregation';
import type { Task } from './types';

function App() {
  const { tasks, memo, addTask, deleteTask, updateMemo } = useAppState();
  // Lifted state for InputForm
  const [formInput, setFormInput] = useState<TaskInput>({
    name: '',
    quantity: '',
    startTime: '',
    endTime: '',
  });
  const [timeError, setTimeError] = useState<string>('');

  // Dirty check: if any field has value, editing is disabled to prevent overwrite
  const isFormDirty = formInput.name !== '' || formInput.quantity !== '' || formInput.startTime !== '' || formInput.endTime !== '';

  const handleEdit = (task: Task) => {
    // Populate form with task values
    setFormInput({
      name: task.name,
      quantity: task.quantity === 0 ? '' : task.quantity,
      startTime: task.startTime,
      endTime: task.endTime,
    });
    // Remove from list (effectively moving it to the form)
    deleteTask(task.id);
  };

  const handleAdd = (task: TaskInput) => {
    // 時間の重複チェック
    if (task.startTime && task.endTime) {
      const overlapping = findOverlappingTask(tasks, task.startTime, task.endTime);
      if (overlapping) {
        setTimeError(`時間帯が「${overlapping.name}」(${overlapping.startTime}～${overlapping.endTime})と重複しています`);
        return;
      }
    }
    setTimeError('');
    addTask(task);
    // Reset form after adding
    setFormInput({
      name: '',
      quantity: '',
      startTime: '',
      endTime: '',
    });
  };

  // 作業名の候補リスト（重複なし）
  const taskNameSuggestions = [...new Set(tasks.map(t => t.name))];

  return (
    <Layout>
      <Header />
      <main>
        <InputForm
          input={formInput}
          onChange={setFormInput}
          onAdd={handleAdd}
          taskNameSuggestions={taskNameSuggestions}
          externalError={timeError}
        />
        <TaskList
          tasks={tasks}
          onDelete={deleteTask}
          onEdit={handleEdit}
          disableEdit={isFormDirty}
        />
        <ReportView tasks={tasks} />
        <MemoArea memo={memo} onMemoChange={updateMemo} />
      </main>
    </Layout>
  );
}

export default App;
