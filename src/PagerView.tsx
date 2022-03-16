import React, { ReactElement } from 'react';
import { Platform, Keyboard, Alert } from 'react-native';
import { I18nManager } from 'react-native';
import type {
  PagerViewOnPageScrollEvent,
  PagerViewOnPageSelectedEvent,
  PageScrollStateChangedNativeEvent,
  PagerViewProps,
} from './types';

import { childrenWithOverriddenStyle } from './utils';
import NativePagerView from './spec/NativePagerView';

/**
 * Container that allows to flip left and right between child views. Each
 * child view of the `PagerView` will be treated as a separate page
 * and will be stretched to fill the `PagerView`.
 *
 * It is important all children are `<View>`s and not composite components.
 * You can set style properties like `padding` or `backgroundColor` for each
 * child. It is also important that each child have a `key` prop.
 *
 * Example:
 *
 * ```
 * render: function() {
 *   return (
 *     <PagerView
 *       style={styles.PagerView}
 *       initialPage={0}>
 *       <View style={styles.pageStyle} key="1">
 *         <Text>First page</Text>
 *       </View>
 *       <View style={styles.pageStyle} key="2">
 *         <Text>Second page</Text>
 *       </View>
 *     </PagerView>
 *   );
 * }
 *
 * ...
 *
 * var styles = {
 *   ...
 *   PagerView: {
 *     flex: 1
 *   },
 *   pageStyle: {
 *     alignItems: 'center',
 *     padding: 20,
 *   }
 * }
 * ```
 */

export class PagerView extends React.Component<PagerViewProps> {
  private isScrolling = false;
  private PagerView = React.createRef<typeof NativePagerView>();
  state = {
    total: 0,
  };

  public getInnerViewNode = (): ReactElement => {
    //@ts-ignore
    return this.PagerView.current!.getInnerViewNode();
  };

  private _onPageScroll = (e: PagerViewOnPageScrollEvent) => {
    if (this.props.onPageScroll) {
      this.props.onPageScroll(e);
    }
    // Not implemented on iOS yet
    if (Platform.OS === 'android') {
      if (this.props.keyboardDismissMode === 'on-drag') {
        Keyboard.dismiss();
      }
    }
  };

  private _onPageScrollStateChanged = (
    e: PageScrollStateChangedNativeEvent
  ) => {
    if (this.props.onPageScrollStateChanged) {
      this.props.onPageScrollStateChanged(e);
    }
    this.isScrolling = e.nativeEvent.pageScrollState === 'dragging';
  };

  private _onPageSelected = (e: PagerViewOnPageSelectedEvent) => {
    if (this.props.onPageSelected) {
      this.props.onPageSelected(e);
    }
  };

  public setTotal = (_: number) => {
    this.setState({ total: this.state.total + 1 });
    Alert.alert('Set', `${this.state.total + 1}`);
  };

  /**
   * A helper function to scroll to a specific page in the PagerView.
   * The transition between pages will be animated.
   */
  public setPage = (_: number) => {
    // UIManager.dispatchViewManagerCommand(
    //   ReactNative.findNodeHandle(this),
    //   getViewManagerConfig().Commands.setPage,
    //   [selectedPage]
    // );
  };

  /**
   * A helper function to scroll to a specific page in the PagerView.
   * The transition between pages will *not* be animated.
   */
  public setPageWithoutAnimation = (_: number) => {
    // UIManager.dispatchViewManagerCommand(
    //   ReactNative.findNodeHandle(this),
    //   getViewManagerConfig().Commands.setPageWithoutAnimation,
    //   [selectedPage]
    // );
  };

  /**
   * A helper function to enable/disable scroll imperatively
   * The recommended way is using the scrollEnabled prop, however, there might be a case where a
   * imperative solution is more useful (e.g. for not blocking an animation)
   */
  public setScrollEnabled = (_: boolean) => {
    // UIManager.dispatchViewManagerCommand(
    //   ReactNative.findNodeHandle(this),
    //   getViewManagerConfig().Commands.setScrollEnabled,
    //   [scrollEnabled]
    // );
  };

  private _onMoveShouldSetResponderCapture = () => {
    return this.isScrolling;
  };

  private get deducedLayoutDirection() {
    const shouldUseDeviceRtlSetup =
      !this.props.layoutDirection || this.props.layoutDirection === 'locale';

    if (shouldUseDeviceRtlSetup) {
      return I18nManager.isRTL ? 'rtl' : 'ltr';
    } else {
      return this.props.layoutDirection;
    }
  }

  render() {
    return (
      <NativePagerView
        {...this.props}
        ref={this.PagerView as any /** TODO: Fix ref type */}
        style={this.props.style}
        // pageIndex={this.props.pageIndex}
        // total={this.state.total}
        layoutDirection={this.deducedLayoutDirection}
        onPageScroll={this._onPageScroll}
        onPageScrollStateChanged={this._onPageScrollStateChanged}
        onPageSelected={this._onPageSelected}
        onMoveShouldSetResponderCapture={this._onMoveShouldSetResponderCapture}
        children={childrenWithOverriddenStyle(this.props.children)}
      />
    );
  }
}
