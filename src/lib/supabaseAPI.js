// Supabase API helpers for all features

import { supabase, DEFAULT_CLUB_ID } from './supabase'

// ============================================
// COMPETITIONS API
// ============================================
export const competitionsAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('competitions')
            .select('*')
            .eq('club_id', DEFAULT_CLUB_ID)
            .order('date', { ascending: false })
        if (error) throw error
        return data || []
    },

    async add(competition) {
        const { data, error } = await supabase
            .from('competitions')
            .insert([{ ...competition, club_id: DEFAULT_CLUB_ID }])
            .select()
            .single()
        if (error) throw error
        return data
    },

    async remove(id) {
        const { error } = await supabase
            .from('competitions')
            .delete()
            .eq('id', id)
        if (error) throw error
    }
}

// ============================================
// ATTENDANCE API
// ============================================
export const attendanceAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .order('date', { ascending: false })
        if (error) throw error
        return data || []
    },

    async mark(athleteId, date, present = true) {
        const { data, error } = await supabase
            .from('attendance')
            .upsert([{ athlete_id: athleteId, date, present }], { onConflict: 'athlete_id,date' })
            .select()
            .single()
        if (error) throw error
        return data
    }
}

// ============================================
// WELLNESS API
// ============================================
export const wellnessAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('wellness')
            .select('*')
            .order('date', { ascending: false })
        if (error) throw error
        return data || []
    },

    async submit(wellness) {
        const avg = (wellness.sleep + wellness.fatigue + wellness.soreness + wellness.stress + wellness.mood) / 5
        const { data, error } = await supabase
            .from('wellness')
            .upsert([{ ...wellness, avg }], { onConflict: 'athlete_id,date' })
            .select()
            .single()
        if (error) throw error
        return data
    }
}

// ============================================
// WORKLOAD API
// ============================================
export const workloadAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('workload')
            .select('*')
            .order('date', { ascending: false })
        if (error) throw error
        return data || []
    },

    async submit(workload) {
        const load = workload.duration * workload.rpe
        const { data, error } = await supabase
            .from('workload')
            .insert([{ ...workload, load }])
            .select()
            .single()
        if (error) throw error
        return data
    }
}

// ============================================
// ATHLETE STATUS API
// ============================================
export const athleteStatusAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('athlete_status')
            .select('*')
        if (error) throw error
        return data || []
    },

    async update(athleteId, status, note = '') {
        const { data, error } = await supabase
            .from('athlete_status')
            .upsert([{ athlete_id: athleteId, status, note }], { onConflict: 'athlete_id' })
            .select()
            .single()
        if (error) throw error
        return data
    }
}

// ============================================
// ANNOUNCEMENTS API
// ============================================
export const announcementsAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('club_id', DEFAULT_CLUB_ID)
            .order('created_at', { ascending: false })
        if (error) throw error
        return data || []
    },

    async add(announcement) {
        const { data, error } = await supabase
            .from('announcements')
            .insert([{ ...announcement, club_id: DEFAULT_CLUB_ID }])
            .select()
            .single()
        if (error) throw error
        return data
    },

    async remove(id) {
        const { error } = await supabase
            .from('announcements')
            .delete()
            .eq('id', id)
        if (error) throw error
    }
}

// ============================================
// REFEREES API
// ============================================
export const refereesAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('referees')
            .select('*')
            .eq('club_id', DEFAULT_CLUB_ID)
            .order('name')
        if (error) throw error
        return data || []
    },

    async add(referee) {
        const { data, error } = await supabase
            .from('referees')
            .insert([{ ...referee, club_id: DEFAULT_CLUB_ID }])
            .select()
            .single()
        if (error) throw error
        return data
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('referees')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        if (error) throw error
        return data
    },

    async remove(id) {
        const { error } = await supabase
            .from('referees')
            .delete()
            .eq('id', id)
        if (error) throw error
    }
}

// ============================================
// INVENTORY API
// ============================================
export const inventoryAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('inventory')
            .select('*')
            .eq('club_id', DEFAULT_CLUB_ID)
            .order('name')
        if (error) throw error
        return data || []
    },

    async add(item) {
        const { data, error } = await supabase
            .from('inventory')
            .insert([{ ...item, club_id: DEFAULT_CLUB_ID }])
            .select()
            .single()
        if (error) throw error
        return data
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('inventory')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        if (error) throw error
        return data
    },

    async remove(id) {
        const { error } = await supabase
            .from('inventory')
            .delete()
            .eq('id', id)
        if (error) throw error
    },

    async assign(itemId, athleteId) {
        const { data, error } = await supabase
            .from('inventory')
            .update({ assigned_to: athleteId, assigned_at: new Date().toISOString() })
            .eq('id', itemId)
            .select()
            .single()
        if (error) throw error
        return data
    },

    async return(itemId) {
        const { data, error } = await supabase
            .from('inventory')
            .update({ assigned_to: null, assigned_at: null, returned_at: new Date().toISOString() })
            .eq('id', itemId)
            .select()
            .single()
        if (error) throw error
        return data
    }
}

// ============================================
// LESSON BOOKINGS API
// ============================================
export const lessonBookingsAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('lesson_bookings')
            .select('*')
            .eq('club_id', DEFAULT_CLUB_ID)
            .order('date', { ascending: true })
        if (error) throw error
        return data || []
    },

    async add(booking) {
        const { data, error } = await supabase
            .from('lesson_bookings')
            .insert([{ ...booking, club_id: DEFAULT_CLUB_ID }])
            .select()
            .single()
        if (error) throw error
        return data
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('lesson_bookings')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        if (error) throw error
        return data
    },

    async cancel(id) {
        const { data, error } = await supabase
            .from('lesson_bookings')
            .update({ status: 'Cancelled' })
            .eq('id', id)
            .select()
            .single()
        if (error) throw error
        return data
    }
}
