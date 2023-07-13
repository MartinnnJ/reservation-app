import { useState, useEffect } from 'react';
import { countdownToDeadline } from '../helpers';
import styles from '../styles/Timer.module.scss';

let componentRenderCount = 0;

function Timer({ deadline, onAppLoadedChange, onTimeOut }) {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      componentRenderCount += 1;
      const timeLeft = countdownToDeadline(deadline);
      if (timeLeft.every(num => num === '00')) {
        onTimeOut();
        clearInterval(intervalId);
      }
      const countdownString = `${timeLeft[0]}d : ${timeLeft[1]}h : ${timeLeft[2]}m : ${timeLeft[3]}s`;
      setCountdown(countdownString);
      
      if (componentRenderCount === 1) {
        onAppLoadedChange(true);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    }
  }, [deadline, onAppLoadedChange, onTimeOut]);

  return (
    <div className={styles.timer}>
      <header className={styles.timer__header}>
        Rezerváciu je potrebné zrealizovať najneskôr do <strong>{deadline}</strong>.
      </header>
      <div className={styles.timer__countdown}>{countdown}</div>
    </div>
  )
}

export default Timer;