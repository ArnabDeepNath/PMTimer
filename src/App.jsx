import { useState, useEffect } from 'react';

export default function App() {
  const [focusTime, setFocusTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [timer, setTimer] = useState(focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);

  useEffect(() => {
    setTimer(focusTime * 60);
  }, [focusTime]);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }

    if (timer === 0) {
      clearInterval(interval);
      handleTimerEnd();
    }

    return () => clearInterval(interval);
  }, [isActive, timer]);

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimer(focusTime * 60);
    setMode('focus');
  };

  const handleTimerEnd = () => {
    if (mode === 'focus') {
      setPomodoroCount(pomodoroCount + 1);
      if ((pomodoroCount + 1) % 4 === 0) {
        setMode('longBreak');
        setTimer(longBreakTime * 60);
      } else {
        setMode('shortBreak');
        setTimer(shortBreakTime * 60);
      }
    } else if (mode === 'shortBreak') {
      setMode('focus');
      setTimer(focusTime * 60);
    } else if (mode === 'longBreak') {
      setMode('focus');
      setTimer(focusTime * 60);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFocusChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setFocusTime(value);
      if (mode === 'focus') {
        setTimer(value * 60);
      }
    }
  };

  const handleShortBreakChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setShortBreakTime(value);
      if (mode === 'shortBreak') {
        setTimer(value * 60);
      }
    }
  };

  const handleLongBreakChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setLongBreakTime(value);
      if (mode === 'longBreak') {
        setTimer(value * 60);
      }
    }
  };

  const handleModeChange = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'focus') {
      setTimer(focusTime * 60);
    } else if (newMode === 'shortBreak') {
      setTimer(shortBreakTime * 60);
    } else if (newMode === 'longBreak') {
      setTimer(longBreakTime * 60);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Pomodoro Timer</h1>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            mode === 'focus' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleModeChange('focus')}
        >
          Focus
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            mode === 'shortBreak' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleModeChange('shortBreak')}
        >
          Short Break
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            mode === 'longBreak' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleModeChange('longBreak')}
        >
          Long Break
        </button>
      </div>

      <div className="text-5xl font-bold mb-8 text-gray-900">{formatTime(timer)}</div>

      <div className="flex space-x-4 mb-8">
        <button
          className={`px-6 py-3 rounded-md text-white font-semibold ${
            isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          onClick={handleStartStop}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          className="px-6 py-3 rounded-md bg-gray-400 text-white font-semibold hover:bg-gray-500"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className="flex space-x-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Focus Time (minutes):</label>
          <input
            type="number"
            value={focusTime}
            onChange={handleFocusChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Short Break (minutes):</label>
          <input
            type="number"
            value={shortBreakTime}
            onChange={handleShortBreakChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Long Break (minutes):</label>
          <input
            type="number"
            value={longBreakTime}
            onChange={handleLongBreakChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>

      <div className="mt-8 text-gray-600">Pomodoros Completed: {pomodoroCount}</div>
    </div>
  );
}