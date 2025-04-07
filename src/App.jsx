import { useState, useEffect } from 'react';

export default function App() {
  const [focusTime, setFocusTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [timer, setTimer] = useState(focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const notificationSound = new Audio('src/assets/alarm.wav');

  // Ask permission for notifications on load
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Reset timer if focus time changes
  useEffect(() => {
    if (mode === 'focus') {
      setTimer(focusTime * 60);
    }
  }, [focusTime]);

  useEffect(() => {
    let interval = null;

    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0 && isActive) {
      clearInterval(interval);
      handleTimerEnd();
    }

    return () => clearInterval(interval);
  }, [isActive, timer]);

  const handleStartStop = () => {
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setMode('focus');
    setTimer(focusTime * 60);
  };

  const handleTimerEnd = () => {
    setIsActive(false);
    notificationSound.play();
    showNotification();

    if (mode === 'focus') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      if (newCount % 4 === 0) {
        setMode('longBreak');
        setTimer(longBreakTime * 60);
      } else {
        setMode('shortBreak');
        setTimer(shortBreakTime * 60);
      }
    } else {
      setMode('focus');
      setTimer(focusTime * 60);
    }
  };

  const showNotification = () => {
    if (Notification.permission === 'granted') {
      const title =
        mode === 'focus'
          ? 'Focus session complete!'
          : mode === 'shortBreak'
          ? 'Short break over!'
          : 'Long break over!';
      const body =
        mode === 'focus'
          ? 'Take a short break or continue when ready.'
          : 'Time to get back to work!';

      new Notification(title, { body });
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
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
      <h2 className='text-2xl font-bold mb-8 text-gray-400'>Developed By Arnab</h2>

      <div className="flex space-x-4 mb-4">
        {['focus', 'shortBreak', 'longBreak'].map((m) => (
          <button
            key={m}
            className={`px-4 py-2 rounded-md ${
              mode === m
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleModeChange(m)}
          >
            {m === 'focus'
              ? 'Focus'
              : m === 'shortBreak'
              ? 'Short Break'
              : 'Long Break'}
          </button>
        ))}
      </div>

      <div className="text-5xl font-bold mb-8 text-gray-900">
        {formatTime(timer)}
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          className={`px-6 py-3 rounded-md text-white font-semibold ${
            isActive
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Focus Time (minutes):
          </label>
          <input
            type="number"
            value={focusTime}
            onChange={handleFocusChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Short Break (minutes):
          </label>
          <input
            type="number"
            value={shortBreakTime}
            onChange={handleShortBreakChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Long Break (minutes):
          </label>
          <input
            type="number"
            value={longBreakTime}
            onChange={handleLongBreakChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 text-gray-600">
        Pomodoros Completed: {pomodoroCount}
      </div>
    </div>
  );
}
