package bestande.bestande;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.PackageList;
import com.facebook.react.bridge.JSIModulePackage;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;

import java.util.ArrayList;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

	private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
		@Override
		public boolean getUseDeveloperSupport() {
			return BuildConfig.DEBUG;
		}

		@Override
		protected List<ReactPackage> getPackages() {
			PackageList packages =  new PackageList(this);
			ArrayList<ReactPackage> list = packages.getPackages();
			list.add(new SharedPreferencesPackage());
			return list;
		}

		@Override
		protected JSIModulePackage getJSIModulePackage() {
				return new ReanimatedJSIModulePackage();
		}
	};

	@Override
	public ReactNativeHost getReactNativeHost() {
		return mReactNativeHost;
	}
}
