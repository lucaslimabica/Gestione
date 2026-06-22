import { useEffect, useState } from 'react';

const Clock = () => {
    const [time, setTime] = useState(() => new Date());

    useEffect(() => {
        // Schedule a function to run every 1000ms that uses setTime to updaate the state with current time
        const id = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // Cleanup the exec from the queue, stoping the interval when the component unmounts
        return () => clearInterval(id);
    }, []); // empty deps array, so run only once on mount

    return (
        <div className="text-sm text-muted tabular-nums justify-center text-center">
            {String(time.getDate()).padStart(2, '0')}/
            {String(time.getMonth() + 1).padStart(2, '0')}/{time.getFullYear()}{' '}
            <br></br>
            {String(time.getHours()).padStart(2, '0')}:
            {String(time.getMinutes()).padStart(2, '0')}:
            {String(time.getSeconds()).padStart(2, '0')}
        </div>
    );
};

export default Clock;
