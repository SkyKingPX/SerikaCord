package dev.serika.serikacord;

import android.app.NotificationManager;
import android.content.Context;
import androidx.annotation.NonNull;
import com.capacitorjs.plugins.pushnotifications.MessagingService;
import com.google.firebase.messaging.RemoteMessage;
import java.util.Map;

/**
 * Replaces the push plugin's FCM service (see AndroidManifest) so data-only
 * call messages can raise a native incoming-call notification even when the
 * app is closed, and "message_read" can remove a notification read on another
 * device. Everything else is still forwarded to the Capacitor plugin.
 */
public class CallMessagingService extends MessagingService {

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        Map<String, String> data = remoteMessage.getData();
        String type = data.get("type");
        if ("call_ring".equals(type)) {
            CallNotifications.show(this, data);
        } else if ("call_cancel".equals(type)) {
            CallNotifications.cancel(this, data.get("roomId"));
        } else if ("message_read".equals(type)) {
            // Read on another device: FCM shows message notifications with
            // id 0 under their tag, so cancel that one.
            String tag = data.get("tag");
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (tag != null && nm != null) nm.cancel(tag, 0);
            return;
        }
        super.onMessageReceived(remoteMessage);
    }
}
