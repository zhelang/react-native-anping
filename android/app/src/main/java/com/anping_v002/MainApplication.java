package com.anping_v002;

import android.app.Application;
import android.util.Log;

import com.robinpowered.react.ScreenBrightness.ScreenBrightnessPackage;
import com.sensormanager.SensorManagerPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.mmazzarolo.beaconsandroid.BeaconsAndroidPackage;
import com.rusel.RCTBluetoothSerial.RCTBluetoothSerialPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.remobile.toast.RCTToastPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFSPackage(),
            new RNSoundPackage(),
            new BeaconsAndroidPackage(),
            new RCTBluetoothSerialPackage(),
			new ReactNativeYouTube(),
			new SensorManagerPackage(),
			new ScreenBrightnessPackage(1000),
			new RCTToastPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
