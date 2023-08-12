"use client";

import { useEffect, useState } from "react";

import { redirect } from "next/navigation";
import supabase from "@/supabase";

type RPS = "rock" | "paper" | "scissors" | null;

const Rooms = ({ params }: { params: { room: string } }) => {
    const [playerRPS, _setPlayerRPS] = useState<RPS>(null);
    const [opponentRPS, _setOpponentRPS] = useState<RPS>(null);
    const [users, _setUsers] = useState<number>(0);

    const setPlayerRPS = (rps: RPS) => {
        _setPlayerRPS(rps);
    };

    const setOpponentRPS = (rps: RPS) => {
        _setOpponentRPS(rps);
    };

    const setUsers = (users: number) => {
        _setUsers(users);
    };

    useEffect(() => {
        const channel = supabase.channel(`rooms_channel:${params.room}`);

        channel.subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                console.log("Subscribed!");

                const presenceTrack = await channel.track({});
            }
        });

        channel.on("broadcast", { event: "new_room" }, (payload) => {
            console.log("Message received!", payload);
        });

        channel.on("broadcast", { event: "player_rps" }, (payload) => {
            setOpponentRPS(payload.payload.rps);
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const presenceState = channel.presenceState();
                // const presence = channel.presence;

                console.log("Presence", presenceState);

                // if (presence[`rooms_channel:${params.room}`].length > 2) {
                //     console.error("Too many people in the room!");
                // }

                let userCount = 0;

                Object.keys(presenceState).forEach((key) => {
                    userCount += presenceState[key].length;
                });

                console.log(userCount, users);
                if (userCount > 2 && users === 0) {
                    console.error("Too many people in the room!");
                    // redirect(`/rooms/${crypto.randomUUID()}`);
                    window.location.href = `/rooms/${crypto.randomUUID()}`;
                }

                setUsers(userCount);
            })
            .on("presence", { event: "join" }, () => {
                console.log("User joined!");
            })
            .on("presence", { event: "leave" }, () => {
                console.log("User left!");
            });

        if (playerRPS !== null) {
            channel.send(
                {
                    type: "broadcast",
                    event: "player_rps",
                    payload: { rps: playerRPS },
                },
                { rps: playerRPS }
            );
        }

        return () => {
            if (channel) {
                channel.unsubscribe();
                supabase.removeChannel(channel);
            }
        };
    }, [params.room, playerRPS]);

    const getResult = () => {
        if (playerRPS === opponentRPS) {
            return "Tie!";
        }

        if (playerRPS === "rock") {
            if (opponentRPS === "paper") {
                return "You lose!";
            }

            if (opponentRPS === "scissors") {
                return "You win!";
            }
        }

        if (playerRPS === "paper") {
            if (opponentRPS === "scissors") {
                return "You lose!";
            }

            if (opponentRPS === "rock") {
                return "You win!";
            }
        }

        if (playerRPS === "scissors") {
            if (opponentRPS === "rock") {
                return "You lose!";
            }

            if (opponentRPS === "paper") {
                return "You win!";
            }
        }

        return "Error!";
    };

    return (
        <div>
            <h2>Room page</h2>
            {/* <button onClick={() => send({ message: crypto.randomUUID() })}>
                Send
            </button> */}

            {playerRPS === null ? (
                <>
                    <button onClick={() => setPlayerRPS("rock")}>
                        <span role="img" aria-label="rock">
                            🪨
                        </span>
                    </button>

                    <button onClick={() => setPlayerRPS("paper")}>
                        <span role="img" aria-label="paper">
                            📄
                        </span>
                    </button>

                    <button onClick={() => setPlayerRPS("scissors")}>
                        <span role="img" aria-label="scissors">
                            ✂️
                        </span>
                    </button>
                </>
            ) : null}

            {opponentRPS === null && playerRPS !== null ? (
                <>
                    <span>Waiting for opponent...</span>
                </>
            ) : null}

            {opponentRPS !== null && playerRPS !== null ? (
                <>
                    <span>Opponent chose: {opponentRPS}</span>
                    <br />
                    <span>You chose: {playerRPS}</span>
                    <br />
                    <span>Result: {getResult()}</span>
                </>
            ) : null}
        </div>
    );
};

export default Rooms;
