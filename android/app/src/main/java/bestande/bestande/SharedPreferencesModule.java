package bestande.bestande;

import android.app.Activity;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class SharedPreferencesModule extends ReactContextBaseJavaModule {
  SharedPreferences preferences;

  public SharedPreferencesModule(ReactApplicationContext reactApplicationContext) {
    super(reactApplicationContext);
    preferences = PreferenceManager.getDefaultSharedPreferences(reactApplicationContext.getApplicationContext());
    System.out.println("SharedPreferencesModule HAS INITIALIZED");
  }

  @Override
  public String getName() {
    return "SharedPreferencesAndroid";
  }

  @ReactMethod
  public void getString(String key, Promise promise) {
    Object value = preferences.getAll().get(key);
    if (value != null) {
      promise.resolve(value.toString());
    } else {
      promise.resolve("");
    }
  }

  @ReactMethod
  public void getBool(String key, Promise promise) {
    Object value = preferences.getAll().get(key);
    if (value != null) {
      promise.resolve((boolean)value);
    }
    else {
      promise.resolve(false);
    }
  }

  @ReactMethod
  public void setString(String key, String value, Promise promise) {
    SharedPreferences.Editor editor = preferences.edit();
    if (value == null) {
      editor.remove(key);
    } else {
      editor.putString(key, value);
    }
    editor.commit();
    promise.resolve("");
  }

  @ReactMethod
  public void setBool(String key, boolean value, Promise promise) {
    SharedPreferences.Editor editor = preferences.edit();
    editor.putBoolean(key, value);
    editor.commit();
    promise.resolve(true);
  }

  @ReactMethod
  public void getInteger(String key, Promise promise) {
    Object value = preferences.getAll().get(key);
    if (value != null) {
      promise.resolve((int) value);
    }
    else {
      promise.resolve(null);
    }
  }

  @ReactMethod
  public void setInteger(String key, int value, Promise promise) {
    SharedPreferences.Editor editor = preferences.edit();
    editor.putInt(key, value);
    editor.commit();
    promise.resolve(true);

  }

  @ReactMethod
  public void hasKey(String key, Promise promise) {
    Object object = preferences.getAll().get(key);
    if (object != null) {
      promise.resolve(true);
    }
    else {
      promise.resolve(false);
    }
  }
}
