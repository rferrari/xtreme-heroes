import { useState, useEffect } from 'react';
import { Button } from "../Button";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time in seconds

  useEffect(() => {
    const nextGameAvailableAt = localStorage.getItem('nextGameAvailableAt');

    if (nextGameAvailableAt) {
      const countdownEndTime = new Date(nextGameAvailableAt).getTime();

      const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = countdownEndTime - now;

        if (difference > 0) {
          setTimeLeft(Math.floor(difference / 1000)); // Convert ms to seconds
        } else {
          setTimeLeft(0); // Countdown has finished
        }
      };

      updateCountdown();
      const intervalId = setInterval(updateCountdown, 1000); // Update every second

      return () => clearInterval(intervalId); // Clear the interval when component unmounts
    }
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      {timeLeft > 0 ? (
        <Button title={formatTime(timeLeft)}
            onClick={() => {}}  // Empty function
            isVisible={true}
          />
      ) : (
        <p></p>
      )}
    </div>
  );
}
