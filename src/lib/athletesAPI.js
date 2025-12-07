// Supabase helper functions for Athletes

import { supabase, DEFAULT_CLUB_ID } from './supabase'

export const athletesAPI = {
    // Get all athletes for the default club
    async getAll() {
        const { data, error } = await supabase
            .from('athletes')
            .select('*')
            .eq('club_id', DEFAULT_CLUB_ID)
            .order('name')

        if (error) throw error
        return data || []
    },

    // Add a new athlete
    async add(athlete) {
        const { data, error } = await supabase
            .from('athletes')
            .insert([{
                ...athlete,
                club_id: DEFAULT_CLUB_ID
            }])
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Update an athlete
    async update(id, updates) {
        const { data, error } = await supabase
            .from('athletes')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Delete an athlete
    async remove(id) {
        const { error } = await supabase
            .from('athletes')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
