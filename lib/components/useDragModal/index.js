import React, { useState, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import animateGroup from './animateGroup';
import useLoading from '../../tools/useLoading';
import useWindowSize from '../../tools/useWindowSize';
import Button from 'antd/es/button';
import 'antd/es/button/style/index.css';
import 'animate.css';
import './index.less';
const useDragModal = (props) => {
    props = Object.assign({ animate: 'fade', visible: false, isMask: true, width: 500, defaultPosition: 'center', draggable: true, supperClose: false, isCancel: true, isOk: true, cancelText: '取消', okText: '确认' }, props);
    /** 记录自动关闭的定时器 */
    const closeTimeout = useRef();
    /** 获取dom的高度 */
    const modalDom = useRef();
    /** 控制显示 */
    const [visible, setVisible] = useState(props.visible ? true : false);
    /** 控制显示的动画 */
    const [fadeIn, setFadeIn] = useState(!visible);
    /** 控制隐藏的动画 */
    const [fadeOut, setFadeOut] = useState(visible);
    /** modal框的位置 */
    const [position, setPosition] = useState({
        x: 50,
        y: 50
    });
    /** 异步加载数据 */
    const { loadingFunc, loading } = useLoading();
    /** 获取变化后的窗口大小 */
    const windowSize = useWindowSize();
    /** 记录起始位置 */
    const startPosition = {
        x: 0,
        y: 0
    };
    /** 设置定时改变值并还原值 */
    const changeAndOriginal = useCallback((set) => {
        set(true);
        let timeout = setTimeout(() => {
            set(false);
            clearTimeout(timeout);
        }, 1000);
    }, []);
    /** 设置显示值 */
    const handleSetVisible = (value) => {
        setVisible((prevVisible) => {
            if (!prevVisible && value === undefined) {
                changeAndOriginal(setFadeIn);
            }
            else if (prevVisible && value === undefined) {
                changeAndOriginal(setFadeOut);
            }
            else if (value !== prevVisible && value) {
                changeAndOriginal(setFadeIn);
            }
            else if (value !== prevVisible && !value) {
                changeAndOriginal(setFadeOut);
            }
            if (value === false && closeTimeout.current) {
                clearTimeout(closeTimeout.current);
            }
            return value !== undefined ? value : !prevVisible;
        });
    };
    /** 切换显示 */
    const triggerVisible = useCallback(() => {
        handleSetVisible();
    }, []);
    /** 打开 */
    const open = useCallback(() => {
        handleSetVisible(true);
    }, []);
    /** 关闭 */
    const close = useCallback(() => {
        handleSetVisible(false);
    }, [visible]);
    /** 拖拽开始 */
    const handleOndragStart = useCallback((e) => {
        e.persist();
        startPosition.x = e.nativeEvent.offsetX;
        startPosition.y = e.nativeEvent.offsetY;
    }, []);
    /** 拖拽结束 */
    const handleOndragEnd = useCallback((e) => {
        e.persist();
        setPosition({
            x: (e.pageX - startPosition.x) / window.innerWidth * 100,
            y: (e.pageY - startPosition.y) / window.innerHeight * 100
        });
    }, []);
    /** 判断动画 */
    const getAnimateClassName = useMemo(() => {
        let returnAnimate = animateGroup[props.animate ? props.animate : 'fade'];
        if (visible && fadeIn) {
            return returnAnimate[0];
        }
        else if (!visible && fadeOut) {
            return returnAnimate[1];
        }
        else {
            return '';
        }
    }, [visible, fadeIn, fadeOut]);
    /** 蒙版动画 */
    const getMaskAnimateClassName = useMemo(() => {
        if (visible && fadeIn) {
            return 'fadeIn';
        }
        else if (!visible && fadeOut) {
            return 'fadeOut';
        }
        else {
            return '';
        }
    }, [visible, fadeIn, fadeOut]);
    /** 判断显示 */
    const getDisplayBlock = useMemo(() => {
        if (visible) {
            return true;
        }
        else if (!visible && fadeOut) {
            return true;
        }
        else {
            return false;
        }
    }, [visible, fadeIn, fadeOut]);
    /** 计算默认位置 */
    const setStartPosition = useCallback(() => {
        let width = props.width;
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let ratioX = (windowWidth - width) / 2 / windowWidth * 100;
        let ratioY = 20;
        let sim = 2;
        switch (props.defaultPosition) {
            case 'left':
                ratioX = sim;
                ratioY = sim;
                break;
            case 'right':
                ratioX = (windowWidth - (windowWidth * (sim / 100) + props.width)) / windowWidth * 100;
                ratioY = sim;
                break;
            default:
        }
        setPosition({
            x: ratioX,
            y: ratioY
        });
    }, []);
    /** 标题 */
    const getTitle = useMemo(() => {
        if (!props.title) {
            return;
        }
        else {
            return (React.createElement("div", { className: "cv-drag-modal-title" }, props.title));
        }
    }, [props.title]);
    // 原始的footer
    const OriginFooter = useMemo(() => {
        return (React.createElement("div", { className: "cv-drag-modal-footer cv-drag-modal-orgin-footer" },
            props.isCancel && React.createElement(Button, { onClick: () => { props.onCancel && props.onCancel(); } }, props.cancelText),
            props.isOk && (React.createElement(Button, { onClick: () => { props.onOk && props.onOk(); }, style: { marginLeft: 8 }, type: "primary", loading: loading }, props.okText))));
    }, [loading]);
    // 获取footer
    const getFooter = useMemo(() => {
        if (props.footer === false) {
            return;
        }
        else if (!props.footer) {
            return React.createElement(React.Fragment, null, OriginFooter);
        }
        else {
            return (React.createElement("div", { className: "cv-drag-modal-footer" }, props.footer));
        }
    }, [props.footer, loading]);
    /** 添加自动关闭定时器 */
    const addCloseTimeout = () => {
        if (props.closeTime && visible === true) {
            closeTimeout.current = window.setTimeout(() => {
                close();
            }, props.closeTime);
        }
    };
    /** 移除自动关闭定时器 */
    const removeCloseTimeout = () => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
        }
    };
    /** 鼠标划入Modal框 */
    const handleModalMouseEnter = useCallback(() => {
        removeCloseTimeout();
    }, [visible]);
    /** 鼠标离开Modal框 */
    const handleModalMouseLeave = useCallback(() => {
        addCloseTimeout();
    }, [visible]);
    // 计算默认的位置
    useEffect(() => {
        setStartPosition();
    }, []);
    /** 设置定时关闭的时间 */
    useEffect(() => {
        addCloseTimeout();
        return removeCloseTimeout;
    }, [visible]);
    /** 窗口大小变化 */
    useEffect(() => {
        if (!props.draggable) {
            setStartPosition();
        }
    }, [windowSize]);
    /** 定义Modal组件 */
    const Modal = memo((modal) => {
        return (React.createElement(React.Fragment, null, getDisplayBlock && (React.createElement("div", { className: `cv-modal animated ${getMaskAnimateClassName}`, style: cvModalStyle, onMouseEnter: handleModalMouseEnter, onMouseLeave: handleModalMouseLeave, ref: (dom) => { modalDom.current = dom; }, onClick: () => { props.supperClose && props.isMask && close(); } },
            React.createElement("div", { className: `cv-drag-modal animated ${getAnimateClassName}`, draggable: props.draggable, onDragStart: handleOndragStart, onDragEnd: handleOndragEnd, style: cvDragModalStyle, onClick: (e) => { e.stopPropagation(); } },
                React.createElement("span", { className: "cv-drag-moda-close", onClick: close }, "\u00D7"),
                getTitle,
                React.createElement("div", { className: "cv-drag-modal-body", style: cvDragModalFooterStyle }, modal.children),
                getFooter)))));
    });
    /** 这单层样式控制 */
    const cvModalStyle = useMemo(() => {
        return {
            backgroundColor: props.isMask ? 'rgba(0, 0, 0, 0.4)' : '',
            pointerEvents: props.isMask ? 'visible' : 'none'
        };
    }, [props.isMask]);
    /** Modal框的样式控制 */
    const cvDragModalStyle = useMemo(() => {
        return {
            display: `${getDisplayBlock ? 'block' : 'none'}`,
            top: `${position.y}%`,
            left: `${position.x}%`,
            width: props.width,
            boxShadow: `${!props.isMask ? '0 0 2px 1px #f0f0f0' : ''}`
        };
    }, [getDisplayBlock, position]);
    /** Modal框footer样式 */
    const cvDragModalFooterStyle = useMemo(() => {
        return {
            marginBottom: props.footer || props.footer === undefined ? 55 : 0
        };
    }, [props.footer]);
    return {
        triggerVisible,
        Modal,
        visible,
        open,
        close,
        recoverPosition: setStartPosition,
        loadingFunc
    };
};
export default useDragModal;
