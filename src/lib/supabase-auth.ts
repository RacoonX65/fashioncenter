import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for authentication
export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
        },
      },
    });

    if (authError) throw authError;

    // Create customer profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('customers')
        .insert([
          {
            user_id: authData.user.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            is_guest: false,
          },
        ]);

      if (profileError) console.error('Profile creation error:', profileError);
    }

    return { user: authData.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData) {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;

    return { user: authData.user, session: authData.session, error: null };
  } catch (error: any) {
    return { user: null, session: null, error: error.message };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get user profile from customers table
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error: any) {
    return { profile: null, error: error.message };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error: any) {
    return { profile: null, error: error.message };
  }
}

