import { RealtimePresenceJoinPayload, RealtimePresenceLeavePayload } from "@supabase/supabase-js";

import { RealtimeChannel } from "@supabase/realtime-js";
import supabase from "@/supabase";
import { useEffect } from "react";

const usePresence = (
    channelName: string,
    {
        onSync,
        onJoin,
        onLeave,
        onStateChange
    }: {
        onSync?: (payload: void) => void;
        onJoin?: (payload: RealtimePresenceJoinPayload<{ [key: string]: any; }>) => void;
        onLeave?: (payload: RealtimePresenceLeavePayload<{ [key: string]: any; }>) => void;
        onStateChange?: (payload: {
            channel: RealtimeChannel;
            status: "CONNECTED" | "DISCONNECTED" | "SUBSCRIBED" | "UNSUBSCRIBED";
        }) => void;
    }
) => {
    useEffect(() => {
        const channel = supabase.channel(channelName);
        onSync && channel.on("presence", { event: "sync" }, onSync);

        onJoin && channel.on("presence", { event: "join" }, onJoin);

        onLeave && channel.on("presence", { event: "leave" }, onLeave);

        onStateChange && channel.subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                onStateChange({ channel, status });
            }
        });


        return () => {
            channel.unsubscribe();
        }
    }, [channelName]);

    return supabase.channel(channelName);
};

export default usePresence;
