import { useState, useCallback, useLayoutEffect } from 'react';
const useWait = (props) => {
    props = Object.assign({ defaultValue: 'E', time: 800 }, props);
    const [wait, setWait] = useState(props.defaultValue);
    /** 切换值 */
    const toggleWait = useCallback(() => {
        if (wait.indexOf('L') > -1)
            return;
        if (wait === 'S') {
            startToEnd();
        }
        else {
            endToStart();
        }
    }, [wait]);
    /** S - E */
    const startToEnd = useCallback(() => {
        setWait('SE');
        let timeout = window.setTimeout(() => {
            setWait('E');
            window.clearInterval(timeout);
        }, props.time);
    }, []);
    /** E - S */
    const endToStart = useCallback(() => {
        setWait('ES');
        let timeout = window.setTimeout(() => {
            setWait('S');
            window.clearInterval(timeout);
        }, props.time);
    }, []);
    /** 控制初始值 */
    useLayoutEffect(() => {
        if (wait === 'S') {
            setWait('E');
            return;
        }
        toggleWait();
    }, []);
    return {
        wait,
        toggleWait,
        startToEnd,
        endToStart
    };
};
export default useWait;
