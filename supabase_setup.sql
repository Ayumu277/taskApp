-- Daily logs table
CREATE TABLE daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  tasks JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Weekly logs table
CREATE TABLE weekly_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  tasks JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Enable Row Level Security
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_logs
CREATE POLICY "Users can view their own daily logs" ON daily_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily logs" ON daily_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily logs" ON daily_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily logs" ON daily_logs
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for weekly_logs
CREATE POLICY "Users can view their own weekly logs" ON weekly_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly logs" ON weekly_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly logs" ON weekly_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly logs" ON weekly_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, date);
CREATE INDEX idx_weekly_logs_user_week ON weekly_logs(user_id, week_start);