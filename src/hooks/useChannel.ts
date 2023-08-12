import supabase from "@/supabase"
import { useEffect } from "react";

const useChannel = <TData>(channelName: string, event: string, callback: (data: {
    [key: string]: any;
    type: "broadcast";
    event: string;
    payload: TData;
}) => void) => {
    useEffect(() => {
        const channel = supabase.channel(channelName);

        channel.on("broadcast", { event }, (payload) => {
            callback(payload as {
                [key: string]: any;
                type: "broadcast";
                event: string;
                payload: TData;
            })
        }).subscribe();

        return () => {
            channel.unsubscribe();
        }
    }, [channelName, event, callback])

    const send = (data: TData) => {
        const chanel = supabase.channel(channelName)
        chanel.subscribe((status) => {
            if (status === "SUBSCRIBED") {
                chanel.send({
                    type: "broadcast",
                    event,
                    payload: data
                });
            }
        })
    }

    return send;
}

export default useChannel;