-- AddForeignKey
ALTER TABLE "Spot" ADD CONSTRAINT "Spot_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;