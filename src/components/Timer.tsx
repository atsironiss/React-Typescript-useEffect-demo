import Container from './UI/Container.tsx';
import { useTimersContext, type Timer as TimerProps } from '../store/timers-context.tsx';
import { useEffect, useRef, useState } from 'react';

export default function Timer({ name, duration }: TimerProps) {
  const interval = useRef<number | null>(null); // initially holding null vlue, but eventually getting a number assigned - refs won't be recreated whenever components run again, unlike variables
  const [remainingTime, setRemainingTime] = useState(duration * 1000);
  const { isRunning } = useTimersContext();

  if (remainingTime <= 0 && interval.current) {
    clearInterval(interval.current);
  }

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      timer = setInterval(function () {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            return prevTime;
          }
          return prevTime - 50;
        });
      }, 50);
      interval.current = timer;
      // clearInterval(timer);
    } else if (interval.current) {
      clearInterval(interval.current);
    }

    return () => clearInterval(timer);// cleanup function called right before the comp unmounts or before the func runs again
  }, [isRunning]);

  const formattedRemainingTime = (remainingTime / 1000).toFixed(2); // outputting num with 2 decimal places


  return (
    <Container as="article">
      <h2>{name}</h2>
      <p><progress max={duration * 1000} value={remainingTime} /></p>
      <p>{formattedRemainingTime}</p>
    </Container>
  );
}
