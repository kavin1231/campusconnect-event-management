DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'EventRequest'
	) THEN
		ALTER TABLE "EventRequest" ADD COLUMN IF NOT EXISTS "bannerUrl" TEXT;
	END IF;
END $$;
