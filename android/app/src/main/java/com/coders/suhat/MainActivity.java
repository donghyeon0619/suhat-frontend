package com.coders.suhat;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    @Override
    protected void load() {
        super.load();
        // Preserve the existing WebView origin and its stored user data. Only
        // API requests bypass the local asset server, including the SSE stream.
        getBridge().setWebViewClient(new BridgeWebViewClient(getBridge()) {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                var url = request.getUrl();
                if ("https".equals(url.getScheme()) && "suhat.kr".equals(url.getHost())
                        && url.getPath() != null && url.getPath().startsWith("/api/")) {
                    return null;
                }
                return super.shouldInterceptRequest(view, request);
            }
        });
    }
}
