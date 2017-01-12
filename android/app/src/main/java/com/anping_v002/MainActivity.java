package com.anping_v002;

import com.facebook.react.ReactActivity;
import com.sensormanager.SensorManagerPackage;

import android.os.Bundle;
import android.view.WindowManager;
import android.content.pm.ActivityInfo;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Anping_V002";
    }
	
	@Override
	
	protected void onCreate(Bundle savedInstanceState){

		super.onCreate(savedInstanceState);
		
		//螢幕常開
		this.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
		
		//翻轉螢幕
		this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
	
	}
}
