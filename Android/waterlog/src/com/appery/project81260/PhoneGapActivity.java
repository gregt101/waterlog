package com.appery.project81260;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.cordova.CordovaChromeClient;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewClient;
import org.apache.cordova.IceCreamCordovaWebViewClient;
import org.apache.cordova.api.CordovaInterface;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.Display;
import android.view.WindowManager;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;

import com.phonegap.plugins.pushnotifications.Constants;
import com.phonegap.plugins.pushnotifications.PushNotifications;


public class PhoneGapActivity extends org.apache.cordova.DroidGap {

    private final static String TAG = "PhoneGapActivity";

    private static final String WORK_DIR = "file:///android_asset/www/";

    protected static final int FILECHOOSER_RESULTCODE = 101;

    public static final String DEFAULT_ACCEPT_TYPE = "image/*";

    protected float ORIG_APP_W = 320;
    protected float ORIG_APP_H = 480;

    protected ValueCallback<Uri> mUploadMessage;
    /**
     * Called when the activity is first created.
     * 
     * @param savedInstanceState
     *            If the activity is being re-initialized after previously being shut down then this Bundle contains the
     *            data it most recently supplied in onSaveInstanceState(Bundle). <b>Note: Otherwise it is null.</b>
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Log.d(TAG, "onCreate");

        super.loadUrl(WORK_DIR + getStartFileName());

        super.appView.setVerticalScrollBarEnabled(false);
        super.appView.setHorizontalScrollBarEnabled(false);
        super.setIntegerProperty("loadUrlTimeoutValue", 60000);
        this.appView.clearCache(false);
        this.appView.clearHistory();
        // set some defaults
        // this.appView.setBackgroundColor(0x000000);
        this.appView.setHorizontalScrollBarEnabled(false);
        this.appView.setHorizontalScrollbarOverlay(false);
        this.appView.setVerticalScrollBarEnabled(false);
        this.appView.setVerticalScrollbarOverlay(false);

        // get actual screen size
        Display display = ((WindowManager) getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay();
        int width = display.getWidth();
        int height = display.getHeight();

        // calculate target scale (only dealing with portrait
        // orientation)
        double globalScale = Math.ceil((width / ORIG_APP_W) * 100);

        // make sure we're all good
        Log.v("ORIG_APP_W", " = " + ORIG_APP_W);
        Log.v("ORIG_APP_H", " = " + ORIG_APP_H);
        Log.v("width", " = " + width);
        Log.v("this.appView.getMeasuredHeight()", " = " + height);
        Log.v("globalScale", " = " + globalScale);
        Log.v("this.appView.getScale()", "index=" + this.appView.getScale());

        // set some defaults on the web view
        this.appView.getSettings().setBuiltInZoomControls(false);
        this.appView.getSettings().setSupportZoom(true);
        this.appView.getSettings().setGeolocationEnabled(true);
        this.appView.getSettings().setLightTouchEnabled(false);

        // caching is preventin android 2.3.3 from working properly with REST calls (ETST-5834, ETST-6716)
        this.appView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);

        this.appView.getSettings().setRenderPriority(WebSettings.RenderPriority.HIGH);

        // set the scale
        // this.appView.setInitialScale((int) globalScale);

        registerReceiver(mHandleMessageReceiver, new IntentFilter(Constants.DISPLAY_MESSAGE_ACTION));
    }

    @Override  
    protected void onActivityResult(int requestCode, int resultCode,  
                                    Intent intent) {  
		super.onActivityResult(requestCode, resultCode, intent);
        if(requestCode==FILECHOOSER_RESULTCODE)  
        {  
            if (null == mUploadMessage) return;  
            Uri result = intent == null || resultCode != RESULT_OK ? null  
                    : intent.getData();  
            mUploadMessage.onReceiveValue(result);  
            mUploadMessage = null;  
        }  
    }    

    /**
     * Create and initialize web container with default web view objects.
     */
    @Override
    public void init() {
        CordovaWebView webView = new CordovaWebView(this);
        CordovaWebViewClient webViewClient;
        if(android.os.Build.VERSION.SDK_INT < 11)
        {
            webViewClient = new CordovaWebViewClient(this, webView);
        }
        else
        {
            webViewClient = new IceCreamCordovaWebViewClient(this, webView);
        }
        this.init(webView, webViewClient, new TiggziChromeClient(this, webView) );
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        Log.d(TAG, "onNewIntent");
        setIntent(intent);

        PushNotifications.handleMessage(intent);
    }

    /*
     * (non-Javadoc)
     * 
     * @see android.app.Activity#onStart()
     */
    @Override
    protected void onStart() {
        super.onStart();
        Log.d(TAG, "onStart");
    }

    /**
     * overrided to avoid backing to first screen
     * 
     * @param newConfig
     */
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        if (getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE) {
            // do nothing
        } else if (getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT) {
            // do your task
        }
        super.onConfigurationChanged(newConfig);

    }

    private String getStartFileName() {
        String fileName = "index.html";
		/*
        try {
            InputStream fstream = getAssets().open("www/descriptor.txt");
            // Get the object of DataInputStream
            DataInputStream in = new DataInputStream(fstream);
            BufferedReader br = new BufferedReader(new InputStreamReader(in));
            String strLine = br.readLine();
            if (strLine != null) {
                fileName = strLine.trim();
            }
            in.close();
        } catch (Exception e) {// Catch exception if any
            Log.e(TAG, e.getMessage(), e);
        }
		*/
        return fileName;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unregisterReceiver(mHandleMessageReceiver);
    }
    
    /* (non-Javadoc)
     * @see android.app.Activity#onBackPressed()
     */
    @Override
    public void onBackPressed() {
        moveTaskToBack(true);
    }

    private final BroadcastReceiver mHandleMessageReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            PushNotifications.handleMessage(intent);
        }
    };

    /** This class is used to make <input type="file" ... /> work in APK **/
    public class TiggziChromeClient extends CordovaChromeClient 
    {
        public TiggziChromeClient(CordovaInterface cordova) {
            super(cordova);
        }
        public TiggziChromeClient(CordovaInterface ctx, CordovaWebView app) {
            super(ctx, app);
        }

        public void openFileChooser(ValueCallback<Uri> uploadMsg) {
            openFileChooser(uploadMsg, DEFAULT_ACCEPT_TYPE);
        }

        public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
            if(acceptType==null || acceptType.length()==0) {
                acceptType = DEFAULT_ACCEPT_TYPE;
            }
            PhoneGapActivity.this.mUploadMessage = uploadMsg;
            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType(acceptType);
            PhoneGapActivity.this.startActivityForResult(Intent.createChooser(i,"File Chooser"), PhoneGapActivity.FILECHOOSER_RESULTCODE);  
        }

        public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
            openFileChooser(uploadMsg, acceptType);
        }
    }
}
