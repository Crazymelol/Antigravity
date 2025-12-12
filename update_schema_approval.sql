-- Add status column to coaches table
alter table coaches 
add column if not exists status text default 'pending';

-- Auto-approve existing coaches so they don't lose access
update coaches 
set status = 'approved' 
where status is null or status = 'pending';

-- Verify the change (optional select)
select * from coaches;
