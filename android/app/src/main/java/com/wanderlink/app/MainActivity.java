package com.wanderlink.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.revenuecat.purchases.capacitor.PurchasesPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(PurchasesPlugin.class);
    }
}
