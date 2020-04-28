const animateGroup = {
  /** 渐进 */
  fade: ['fadeIn', 'fadeOut'],
  /** 下方渐进 */
  fadeDown: ['fadeInDown', 'fadeOutDown'],
  /** 快速下方渐进 */
  fadeDownBig: ['fadeInDownBig', 'fadeOutDownBig'],
  /** 左侧渐进 */
  fadeLeft: ['fadeInLeft', 'fadeOutLeft'],
  /** 快速左侧渐进 */
  fadeLeftBig: ['fadeInLeftBig', 'fadeOutLeftBig'],
  /** 右侧渐进 */
  fadeRight: ['fadeInRight', 'fadeOutRight'],
  /** 右侧快速渐进 */
  fadeRightBig: ['fadeInRightBig', 'fadeOutRightBig'],
  /** 上方渐进 */
  fadeUp: ['fadeInUp', 'fadeOutUp'],
  /** 上方快速渐进 */
  fadeUpBig: ['fadeInUpBig', 'fadeOutUpBig'],
  /** 缩放 */
  zoom: ['zoomIn', 'zoomOut'],
  /** 旋转 */
  rotate: ['rotateIn', 'rotateOut'],
  /** 弹跳 */
  bounce: ['bounceIn', 'bounceOut'],
  /** 向上弹跳 */
  bounceUp: ['bounceInUp', 'bounceOutUp'],
  /** 横轴选转 */
  flipX: ['flipInX', 'flipOutX'],
  /** 纵轴选转 */
  flipY: ['flipInY', 'flipOutY'],
  /** 四边形渐入 */
  lightSpeed: ['lightSpeedIn', 'lightSpeedOut'],
  /**  */
  roll: ['rollIn', 'rollOut']
}

// export type Animate = 'fade' | 'zoom' | 'rotate' | 'bounce' | 'bounceUp' | 'fadeDown' | 'fadeDownBig' | 'fadeLeft' | 'fadeLeftBig' | 'fadeRight' | 'fadeUp' | 'fadeUpBig' | 'flipX' | 'flipY' | 'lightSpeed' | 'roll';
// type toAnimate<T> = () => [P in keyof T]
export type Animate = keyof typeof animateGroup;
// type toAnimate<T> = T extends keyof T;

export default animateGroup
