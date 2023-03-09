import { useAuth } from "../context/authContext";
import { supabase } from "../supabase";

const { user, setUser } = useAuth();
