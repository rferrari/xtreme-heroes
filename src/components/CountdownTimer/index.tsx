import { useState, useEffect } from 'react';
import { Button } from "../Button";

type CountdownTimerProps = {
  onComplete: () => void;
  // onCheck: () => void;
};

export default function CountdownTimer({ onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time in seconds

  useEffect(() => {
    const nextGameAvailableAt = localStorage.getItem('recoveryAt');

    if (nextGameAvailableAt) {
      const countdownEndTime = new Date(nextGameAvailableAt).getTime();

      const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = countdownEndTime - now;

        if (difference > 0) {
          setTimeLeft(Math.floor(difference / 1000)); // Convert ms to seconds
        } else {
          setTimeLeft(0); // Countdown has finished
          onComplete(); // Trigger when countdown finishes
        }
      };

      updateCountdown();
      // onCheck();
      const intervalId = setInterval(updateCountdown, 1000); // Update every second

      return () => clearInterval(intervalId); // Clear interval on component unmount
    } else {
      onComplete(); // Trigger when countdown finishes
    }
  }, [onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      {timeLeft > 0 ? (
        <Button title={formatTime(timeLeft)}
            onClick={() => {}}  // Disable button click during countdown
            isVisible={true}
          />
      ) : (
        <p></p> // Or you can render nothing here once the countdown is done
      )}
    </div>
  );
}
