package com.zkatak;

import com.facebook.react.ReactActivity;

        import com.facebook.react.ReactActivityDelegate;
        import com.facebook.react.ReactRootView;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
      I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
      sharedI18nUtilInstance.allowRTL(MainActivity.this, true);
        sharedI18nUtilInstance.forceRTL(MainActivity.this,true);
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Zkatak";
  }
}
