import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import supabase from "@/supabase";

const useAuth = () => {
    // authdata
    const [auth, setAuth] = useState<Session | null>(null);

    const setSession = (event: AuthChangeEvent, session: Session | null) => {
        setAuth(session);
    }

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(setSession);
        return () => {
            authListener?.subscription.unsubscribe();
        }
    }, []);

    return auth;
}

export default useAuth;