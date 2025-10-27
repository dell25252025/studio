package com.wanderlink.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.getcapacitor.PermissionState;
import java.util.HashMap;
import java.util.Map;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;


public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(MicrophonePlugin.class);
    }
}

@CapacitorPlugin(
    name = "Microphone",
    permissions = {
        @Permission(
            alias = "microphone",
            strings = { "android.permission.RECORD_AUDIO" }
        )
    }
)
class MicrophonePlugin extends Plugin {

    @PluginMethod
    public void checkPermissions(PluginCall call) {
        Map<String, String> permissions = new HashMap<>();
        permissions.put("microphone", getPermissionState("microphone").toString());
        call.resolve(permissions);
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        requestPermissionForAlias("microphone", call, "permissionsCallback");
    }

    @PermissionCallback
    private void permissionsCallback(PluginCall call) {
        Map<String, String> permissions = new HashMap<>();
        permissions.put("microphone", getPermissionState("microphone").toString());
        call.resolve(permissions);
    }
}
